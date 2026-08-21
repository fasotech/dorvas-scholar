require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");
  
  const db = mongoose.connection.db;
  
  const s = await db.collection('students').updateMany({ status: { $exists: false } }, { $set: { status: "active" } });
  const t = await db.collection('teachers').updateMany({ status: { $exists: false } }, { $set: { status: "active" } });
  const c = await db.collection('schoolclasses').updateMany({ status: { $exists: false } }, { $set: { status: "active" } });
  
  console.log("Students updated:", s.modifiedCount);
  console.log("Teachers updated:", t.modifiedCount);
  console.log("Classes updated:", c.modifiedCount);
  process.exit(0);
}
run();
