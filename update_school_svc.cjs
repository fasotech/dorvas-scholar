const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

const newFunc = `
export async function createRecord(platformUser: PlatformUser, section: DashboardSection, payload: any) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== 'connected') throw new Error('Database not connected');
  if (identity.role !== 'admin' && identity.role !== 'teacher') throw new Error('Unauthorized');
  
  const definition = recordDefinitions[section];
  const model = definition.model;
  
  // Create document
  const doc = await model.create({
    ...payload,
    isDeleted: false,
    schoolId: identity.profileId || 'default-school'
  });
  
  return { success: true, id: doc._id };
}
`;

code = code + '\n' + newFunc;
fs.writeFileSync('server/services/school.ts', code);
