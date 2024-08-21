import { useDrizzle } from "~/server/utils/drizzle";
import * as tables from "../database/schema";
import { useEmail } from "~/server/utils/email";

function castInt(input: boolean) {
  if (input) {
    return 1;
  }
  return 0;
}

export default eventHandler(async (event) => {
  // Read the body of the request
  const body = await readBody(event);

  // Insert the new donor into the database
  const drizzle = useDrizzle();
  const donor = await drizzle.query.donors.findFirst({
    where: eq(tables.donors.id, body.donorId),
  });

  if (!donor) {
    return {
      status: "error",
      message: "Donor not found",
    };
  }

  console.log({
    body,
  });

  if (body.email) {
    await drizzle
      .update(tables.donors)
      .set({
        email: body.email,
      })
      .where(eq(tables.donors.id, donor.id))
      .returning();
  }

  const donation = await drizzle
    .insert(tables.donations)
    .values({
      ...body,
      dataDestruction: castInt(body.dataDestruction),
      createdAt: body.createdAt || new Date(), // Use current timestamp if not provided
    })
    .returning()
    .then((r) => r[0]);

  const { send } = useEmail();

  const itemCounts = Object.entries<any>(body.itemCounts)
    .filter(([itemType, count]) => count > 0)
    .map(([itemType, count]) => {
      return `${itemType} - ${count} units`;
    });

  try {
    const configEmailText = await drizzle.query.config.findFirst({
      where: (config, { eq }) => eq(config.key, "emailText"),
    });

    if (donor.email) {
      await send({
        to: donor.email,
        from: process.env.MAIL_FROM ?? "office@ccreuse.org",
        subject: "Thank you for your donation!",
        text: [
          configEmailText?.value ??
            "Please configure email text in the admin panel",
          "",
          ...itemCounts,
          "",
          ...(body.dataDestruction ?? false
            ? [
                `A Data Destruction Letter has been requested and will follow on a separate email when the hard-drives have been securely erased or destroyed. Your donation ID is ${donation.id}`,
              ]
            : []),
        ].join("\n"),
      });
    }
  } catch (e) {
    console.log("Error sending email", e);
  }

  try {
    if (body.dataDestruction) {
      const sendTo =
        process.env.NUXT_PUBLIC_DESTRUCTION_EMAILS?.split(",") ?? [];
      for (const email of sendTo) {
        console.log("Sending to", email);
        await send({
          to: email,
          from: process.env.MAIL_FROM ?? "office@ccreuse.org",
          replyTo: donor.email ?? body.email,
          subject: "Data Destruction Letter Requested",
          text: [
            `A Data Destruction Letter Has Been Requested for Donation #${donation.id}`,
            `${donor.firstName ?? ""} ${donor.lastName ?? ""}`,
            `${donor.email}`,
            "",
            ...itemCounts,
            "",
            ...(donation.centsReceived
              ? `Received $${donation.centsReceived}`
              : ""),
          ].join("\n"),
        });
      }
    }
  } catch (e) {
    console.log("Error sending email", e);
  }

  return {
    status: "success",
    message: "Donation created successfully",
    donation,
  };
});
