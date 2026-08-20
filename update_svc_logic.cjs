const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

const replacement = `
import bcrypt from "bcryptjs";

export async function createRecord(platformUser: PlatformUser, section: DashboardSection, payload: any) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== 'connected') throw new Error('Database not connected');
  if (identity.role !== 'admin' && identity.role !== 'teacher') throw new Error('Unauthorized');
  
  const definition = recordDefinitions[section];
  const model = definition.model;
  
  // Custom logic for Students and Teachers to auto-generate login accounts
  if (section === "students" || section === "teachers") {
    let email = payload.fullName.toLowerCase().replace(/\\s+/g, '.') + '@dorvas.edu.ng';
    
    // Check if email exists
    let exists = await SchoolUser.findOne({ email });
    let counter = 1;
    while(exists) {
      email = payload.fullName.toLowerCase().replace(/\\s+/g, '.') + counter + '@dorvas.edu.ng';
      exists = await SchoolUser.findOne({ email });
      counter++;
    }

    const hashedPassword = await bcrypt.hash(payload.password || "Password123!", 10);
    
    // Create the Student or Teacher record first
    const recordPayload = { ...payload };
    delete recordPayload.password; // Don't save plaintext password to the student record
    recordPayload.name = recordPayload.fullName;
    
    const doc = await model.create({
      ...recordPayload,
      isDeleted: false,
      schoolId: identity.profileId || 'default-school'
    });

    // Create the SchoolUser login account linked to it
    await SchoolUser.create({
      email,
      password: hashedPassword,
      displayName: payload.fullName,
      role: section === "students" ? "student" : "teacher",
      profileType: section === "students" ? "Student" : "Teacher",
      profileId: doc._id,
      isActive: true,
      isDeleted: false
    });

    return { success: true, id: doc._id, email };
  }
  
  // Create generic document for other sections
  const doc = await model.create({
    ...payload,
    isDeleted: false,
    schoolId: identity.profileId || 'default-school'
  });
  
  return { success: true, id: doc._id };
}
`;

code = code.replace(/export async function createRecord[\s\S]*?id: doc\._id \};\n\}/, replacement.trim());
fs.writeFileSync('server/services/school.ts', code);
