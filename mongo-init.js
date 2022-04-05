
db = db.getSiblingDB('admin');
// move to the admin db - always created in Mongo
db.auth("root", "root123");

db = db.getSiblingDB('homerunner');

db.createUser({
    user: 'homerunner',
    pwd: 'homerunner123',
    roles: [
      {
        role: 'dbOwner',
        db: 'homerunner',
      },
    ],
  });