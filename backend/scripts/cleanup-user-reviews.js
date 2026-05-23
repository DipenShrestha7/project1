import sequelize from "../src/config/db.js";
import HistoryModel from "../src/models/HistoryModel.js";

const userIdArg = process.argv.find((arg) => arg.startsWith("--userId="));
const userId = userIdArg ? Number(userIdArg.split("=")[1]) : null;

if (!userId || !Number.isFinite(userId)) {
  console.error("Usage: node scripts/cleanup-user-reviews.js --userId=<id>");
  process.exit(1);
}

const isReviewed = (row) =>
  typeof row.review_text === "string" && row.review_text.trim().length > 0;

try {
  await sequelize.authenticate();

  const rows = await HistoryModel.findAll({
    where: { user_id: userId },
    raw: true,
  });

  const reviewedRows = rows.filter(isReviewed);

  console.log(
    `Found ${reviewedRows.length} reviewed travel rows for user ${userId}.`,
  );

  if (reviewedRows.length === 0) {
    console.log("Nothing to clean up.");
    process.exit(0);
  }

  await HistoryModel.update(
    { review_text: null, rating: null },
    {
      where: {
        user_id: userId,
      },
    },
  );

  const afterRows = await HistoryModel.findAll({
    where: { user_id: userId },
    raw: true,
  });
  const remainingReviewed = afterRows.filter(isReviewed).length;

  console.log(
    `Cleanup complete. Remaining reviewed rows for user ${userId}: ${remainingReviewed}`,
  );
} catch (error) {
  console.error("Cleanup failed:", error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
