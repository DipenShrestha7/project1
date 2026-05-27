import sequelize from "../src/config/db.js";
import { QueryTypes } from "sequelize";

const run = async () => {
  try {
    const existingReportTypes = await sequelize.query(
      `SELECT e.enumlabel
       FROM pg_type t
       JOIN pg_enum e ON e.enumtypid = t.oid
       WHERE t.typname = 'enum_user_reports_type'
       ORDER BY e.enumsortorder`,
      { type: QueryTypes.SELECT },
    );

    const hasFeatureRequestType = existingReportTypes.some(
      (row) => row.enumlabel === "feature_requests",
    );

    if (!hasFeatureRequestType) {
      await sequelize.query(
        `ALTER TYPE "enum_user_reports_type" ADD VALUE 'feature_requests'`,
      );
      console.log("Added feature_requests to enum_user_reports_type");
    } else {
      console.log("Enum already includes feature_requests");
    }

    await sequelize.query(
      `ALTER TABLE "user_reports" DROP CONSTRAINT IF EXISTS "user_reports_type_check"`,
    );
    await sequelize.query(
      `ALTER TABLE "user_reports"
       ADD CONSTRAINT "user_reports_type_check"
       CHECK (type::text = ANY (ARRAY['bug'::text, 'feedback'::text, 'feature_requests'::text]))`,
    );
    console.log("Refreshed user_reports_type_check");
  } catch (error) {
    console.error("Migration failed:", error?.message || error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

void run();
