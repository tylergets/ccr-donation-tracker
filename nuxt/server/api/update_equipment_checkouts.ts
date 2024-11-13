import { useDrizzle } from "~/server/utils/drizzle";
import * as tables from "../database/schema";
import { eq } from "drizzle-orm";
import { useEmail } from "~/server/utils/email";

export default eventHandler(async (event) => {
  const body = await readBody(event);

  // Extract required fields from the body
  const { requestId, approvedBy, denied } = body;

  if (!requestId) {
    throw createError({
      statusCode: 400,
      message: "Request ID is required",
    });
  }

  // Get drizzle instance
  const drizzle = useDrizzle();

  // Approve or disapprove the equipment request
  const updatedRequest: any = await drizzle
      .update(tables.equipmentCheckOuts)
      .set({
        approvedBy: approvedBy || null, // Null implies disapproval
        approvedAt: approvedBy ? new Date() : null, // Only set approvedAt if approved
        deniedAt: denied ? new Date() : null, // Only set approvedAt if approved
      })
      .where(eq(tables.equipmentCheckOuts.id, requestId))
      .returning()
      .then((r) => r[0]);

  if (!updatedRequest) {
    throw createError({
      statusCode: 404,
      message: "Request not found",
    });
  }

  // Get the volunteer associated with the request
  const volunteer = await drizzle.query.volunteers.findFirst({
    where: (volunteers, { eq }) => eq(volunteers.id, updatedRequest.volunteerId),
  });

  if (!volunteer) {
    throw createError({
      statusCode: 404,
      message: "Volunteer not found",
    });
  }

  // Parse the items from the request
  let itemsList: any = [];
  console.log(updatedRequest.items);
  try {
    itemsList = Object.keys(JSON.parse(updatedRequest.items));
  } catch (e) {
    console.log("Error parsing items JSON", e);
  }

  const itemsText = itemsList.length
      ? itemsList.map((item: any, index: any) => `${index + 1}. ${item}`).join("\n")
      : "No items specified.";

  // Send email to the volunteer
  const { send } = useEmail();

  try {
    await send({
      to: volunteer.email,
      from: process.env.MAIL_FROM ?? "office@ccreuse.org",
      subject: approvedBy
          ? "Equipment Request Approved"
          : "Equipment Request Denied",
      text: approvedBy
          ? `Hello ${volunteer.name},

Your equipment request #${requestId} has been approved.

Equipment Checked Out:
${itemsText}

Thank you!`
          : `Hello ${volunteer.name},

Your equipment request #${requestId} has been denied. Please return any equipment.

Requested Equipment:
${itemsText}

Please contact us for more information.`,
    });
  } catch (e) {
    console.log("Error sending email", e);
  }

  return {
    status: "success",
    message: approvedBy
        ? "Request approved successfully"
        : "Request denied successfully",
    updatedRequest,
  };
});
