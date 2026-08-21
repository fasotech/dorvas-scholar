import { connect, disconnect } from "mongoose";
import { Student, SchoolUser } from "./server/models/school";

async function run() {
  await connect(process.env.MONGODB_URI || "mongodb+srv://microsoftportharcourt:dZ7uG4oK5lRkR2eX@cluster0.aomz7.mongodb.net/dorvas?retryWrites=true&w=majority&appName=Cluster0");
  
  const students = await Student.find({ email: { $exists: true, $ne: "" } });
  for (const student of students) {
    if (student.email) {
      await SchoolUser.updateMany(
        { profileId: student._id },
        { $set: { email: student.email.toLowerCase() } }
      );
    }
  }
  
  console.log("Synced emails successfully.");
  await disconnect();
}
run();
