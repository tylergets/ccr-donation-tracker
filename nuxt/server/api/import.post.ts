import { readFiles } from 'h3-formidable'
import {execa} from 'execa';
import * as tables from "../database/schema";

async function parseTable(filepath: any, table: any): Promise<any[]> {
  const tableOutput = await execa`mdb-json ${filepath} ${table}`.then((r) => r.stdout).then((r) => r.split('\n'))
  const jsonOutput = tableOutput.map((row) => JSON.parse(row));
  return jsonOutput;
}

export default eventHandler(async (event) => {

  const { files: { file } } = await readFiles(event);
  const {filepath} = file[0];

  // const {stdout} = await execa`mdb-tables -1 ${filepath}`;
  // let tables = stdout.split('\n').filter(Boolean);

  const donations = await parseTable(filepath, 'Donation');
  const donors = await parseTable(filepath, 'DonorName');

  const donorCache: any = {};

  async function findDonorById(id: string) {
    if(!donorCache[id]) {
      const donor = donors.find((donor) => donor.DonorNameKey === id);

      donorCache[id] = await useDrizzle().insert(tables.donors).values({
        firstName: donor.FirstName,
        lastName: donor.LastName,
        businessName: donor.BusinessName,

        email: donor.Email,
        phone: donor.Phone,

        isIndividual: donor.Individual,
        isBusiness: donor.Business,

        city: donor.City,
        state: donor.State,
        zip: donor.Zip,
        address: donor.Address,
        createdAt: new Date(),
      } as any).onConflictDoNothing().returning().then((r) => r[0]);
    }

    return donorCache[id];
  }

  for (const importData of donations) {
    // create the donation
    const {DonationKey} = importData;
    const donor = await findDonorById(DonationKey);

    if (!donor) {
      throw new Error(`Donor not found for donation: ${DonationKey}`);
    }

    const itemTypes = [
      "Desktops",
      "Laptops",
      "Servers",
      "Portable Electronics",
      "CRT Monitor",
      "LCD Monitor",
      "TV",
      "Network Device",
      "UPS",
      "Printer",
      "Box of Accessories",
      "Boxes of Wires"
    ];

    const itemCounts: any = {};
    for (const itemType of itemTypes) {
      const count = importData[itemType];
      if (count) {
        itemCounts[itemType] = count;
      }
    }

    let value = {
      donorId: donor.id,
      createdAt: new Date(importData.DonationTime),
      itemCounts,
      totalCount: 0,
      notes: importData.Notes,
      receivedBy: donor.ReceivedBy ?? "System",
    };

    const newDonation = await useDrizzle().insert(tables.donations)
        .values(value)
        .onConflictDoNothing().returning();
    console.log({newDonation})
  }

  return {
    success: true,
  };
})
