
db = db.getSiblingDB('admin');
// move to the admin db - always created in Mongo
db.auth("root", "root123");

db = db.getSiblingDB('homerunner');

db.createUser({
    user: 'homerun',
    pwd: 'runner',
    roles: [
      {
        role: 'dbOwner',
        db: 'homerunner',
      },
    ],
  });