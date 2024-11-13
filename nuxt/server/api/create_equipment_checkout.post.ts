import { useDrizzle } from "~/server/utils/drizzle";
import * as tables from "../database/schema";
import { useEmail } from "~/server/utils/email";
import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  // Read the body of the request
  const body = await readBody(event);

  // Get drizzle instance
  const drizzle = useDrizzle();

  // Extract volunteerName from the body
  const volunteerName = body.volunteerName;
  const volunteerEmail = body.volunteerEmail;

  // Fetch the volunteer from the database
  let volunteer: any = await drizzle.query.volunteers.findFirst({
    where: eq(tables.volunteers.name, volunteerName),
  });

  // If volunteer not found, create a new one
  if (!volunteer) {
    volunteer = await drizzle
        .insert(tables.volunteers)
        .values({
          name: volunteerName,
          email: volunteerEmail,
          createdAt: new Date(),
        })
        .returning()
        .then((r) => r[0]);
  }

  // Prepare the values for insertion
  const equipmentCheckOutValues: any = {
    volunteerId: volunteer.id,
    items: JSON.stringify(body.items), // Assuming body.items is an object
    createdAt: body.createdAt || new Date(), // Use current timestamp if not provided
  };

  // Include approval information if provided
  if (body.approvedBy) {
    equipmentCheckOutValues.approvedBy = body.approvedBy;
  }

  if (body.approvedAt) {
    equipmentCheckOutValues.approvedAt = body.approvedAt;
  }

  // Insert the new equipment checkout into the database
  const equipmentCheckOut = await drizzle
      .insert(tables.equipmentCheckOuts)
      .values(equipmentCheckOutValues)
      .returning()
      .then((r) => r[0]);

  // Process items for email notification
  const itemDescriptions = Object.entries<any>(body.items)
      .filter(([itemType, count]) => count > 0)
      .map(([itemType, count]) => {
        return `${itemType} - ${count} units`;
      });

  // Optionally, send email notifications to administrators
  try {
    const { send } = useEmail();

    // Fetch admin emails from environment variables
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") ?? [];

    if (adminEmails.length > 0) {
      await send({
        to: adminEmails,
        from: process.env.MAIL_FROM ?? "office@ccreuse.org",
        subject: "New Equipment Checkout Request",
        text: [
          `A new equipment checkout request has been created by ${volunteer.name}.`,
          "",
          "Items:",
          ...itemDescriptions,
          "",
          `Created At: ${equipmentCheckOut.createdAt}`,
        ].join("\n"),
      });
    }
  } catch (e) {
    console.log("Error sending email", e);
  }

  // Return success response
  return {
    status: "success",
    message: "Equipment checkout created successfully",
    equipmentCheckOut,
  };
});
