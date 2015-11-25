initJson = function(){
	timetables = [
			{
 				"email" : "info@niklashohenwarter.com", 
 				"times" : [ { "row" : 1, "start" : "08:00", "end" : "08:50" }, 
						{ "row" : 2, "start" : "08:50", "end" : "09:40" },
						{ "row" : 3, "start" : "09:50", "end" : "10:40" }, 
						{ "row" : 4, "start" : "10:40", "end" : "11:30" }, 
						{ "row" : 5, "start" : "11:30", "end" : "12:20" }, 
						{ "row" : 6, "start" : "12:30", "end" : "13:20" }, 
						{ "row" : 7, "start" : "13:20", "end" : "14:10" }, 
						{ "row" : 8, "start" : "14:10", "end" : "15:00" }, 
						{ "row" : 9, "start" : "15:10", "end" : "16:00" }, 
						{ "row" : 10, "start" : "16:00", "end" : "16:50" } 
	    				], 
 				"fields" : [ { "id" : 11, "subject" : "E", "teacher" : "STAE", "room" : "H1127", "notebook" : "" }, 
						{ "id" : 12, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 13, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 14, "subject" : "D", "teacher" : "KRAR", "room" : "H928", "notebook" : "" }, 
						{ "id" : 15, "subject" : "SYT", "teacher" : "BORM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 16, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 21, "subject" : "E", "teacher" : "STAE", "room" : "H1127", "notebook" : "" }, 
						{ "id" : 22, "subject" : "WIR3", "teacher" : "PAMT", "room" : "H928", "notebook" : "" }, 
						{ "id" : 23, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 24, "subject" : "D", "teacher" : "KRAR", "room" : "H928", "notebook" : "" }, 
						{ "id" : 25, "subject" : "SYT", "teacher" : "BORM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 26, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 31, "subject" : "RK", "teacher" : "BILM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 32, "subject" : "WIR3", "teacher" : "PAMT", "room" : "H928", "notebook" : "" }, 
						{ "id" : 33, "subject" : "AM", "teacher" : "KRUC", "room" : "H928", "notebook" : "" }, 
						{ "id" : 34, "subject" : "INSY", "teacher" : "VANH", "room" : "H928", "notebook" : "" }, 
						{ "id" : 35, "subject" : "SYT", "teacher" : "BORM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 36, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 41, "subject" : "RK", "teacher" : "BILM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 42, "subject" : "SYT", "teacher" : "LEPW", "room" : "H928", "notebook" : "" }, 
						{ "id" : 43, "subject" : "AM", "teacher" : "KRUC", "room" : "H928", "notebook" : "" }, 
						{ "id" : 44, "subject" : "INSY", "teacher" : "VANH", "room" : "H928", "notebook" : "" }, 
						{ "id" : 45, "subject" : "SYT", "teacher" : "BORM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 46, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 51, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 52, "subject" : "SYT", "teacher" : "WEIJ", "room" : "H928", "notebook" : "" }, 
						{ "id" : 53, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 54, "subject" : "INSY", "teacher" : "MARM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 55, "subject" : "SYT", "teacher" : "BORM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 56, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 61, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 62, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 63, "subject" : "SYT", "teacher" : "WEIJ", "room" : "H928", "notebook" : "" }, 
						{ "id" : 64, "subject" : "INSY", "teacher" : "MARM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 65, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 66, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 71, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 72, "subject" : "SEW", "teacher" : "DOLD", "room" : "H928", "notebook" : "" }, 
						{ "id" : 73, "subject" : "ITP2", "teacher" : "KRIW", "room" : "H928", "notebook" : "" }, 
						{ "id" : 74, "subject" : "SYT", "teacher" : "BORM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 75, "subject" : "ITP2", "teacher" : "KRIW", "room" : "H928", "notebook" : "" }, 
						{ "id" : 76, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 81, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 82, "subject" : "SEW", "teacher" : "DOLD", "room" : "H928", "notebook" : "" }, 
						{ "id" : 83, "subject" : "ITP2", "teacher" : "KRIW", "room" : "H928", "notebook" : "" }, 
						{ "id" : 84, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 85, "subject" : "ITP2", "teacher" : "KRIW", "room" : "H928", "notebook" : "" }, 
						{ "id" : 86, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 91, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 92, "subject" : "BESP", "teacher" : "FEJW", "room" : "LU2", "notebook" : "" }, 
						{ "id" : 93, "subject" : "ITP2", "teacher" : "KRIW", "room" : "H928", "notebook" : "" }, 
						{ "id" : 94, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 95, "subject" : "SYT", "teacher" : "GRAM", "room" : "H928", "notebook" : "" }, 
						{ "id" : 96, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 101, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 102, "subject" : "BESP", "teacher" : "FEJW", "room" : "LU2", "notebook" : "" }, 
						{ "id" : 103, "subject" : "ITP", "teacher" : "KRIW", "room" : "H928", "notebook" : "" }, 
						{ "id" : 104, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 105, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" }, 
						{ "id" : 106, "subject" : "", "teacher" : "", "room" : "", "notebook" : "" } 
	    				] 
			
			}
		]
	notebooks = [
			{ 
				"name" : "Test1", 
				"is_public" : true, 
				"create_date" : ISODate("2015-11-03T18:40:23.822Z"), "last_change" : ISODate("2015-11-04T22:47:41.490Z"), 
				"email" : "test@test.test", 
				"numpages" : 2 
			},
			{ 
				"name" : "Test2", 
				"is_public" : true, 
				"create_date" : ISODate("2015-11-03T18:40:31.468Z"), "last_change" : ISODate("2015-11-03T18:40:31.468Z"), 
				"email" : "test@test.test", 
				"numpages" : 2 
			},
			{ 
				"name" : "Test3", 
				"is_public" : false, 
				"create_date" : ISODate("2015-11-03T18:40:37.087Z"), "last_change" : ISODate("2015-11-03T18:40:37.087Z"), 
				"email" : "test@test.test", 
				"numpages" : 2 
			}
		]
	users = [
			{
				"_cls" : "User", 
				"email" : "test@test.test", 
				"first_name" : "Test_firstname", "last_name" : "Test_lastname", 
				"password" : "pbkdf2_sha256$20000$1JxoKx14CfFr$uiawkMJlJ2vsJEQWV9QGLRNrotU2QmYjNZWU8+gIUts=", 
				"is_staff" : false, "is_prouser" : true, "is_active" : true, "is_superuser" : true, 
				"last_login" : ISODate("2015-11-23T14:44:58.960Z"), "date_joined" : ISODate("2015-11-02T11:33:18.851Z"), 
				"user_permissions" : [ ]
			},
			{ 
				"_cls" : "User", 
				"email" : "sbrinnich@gmx.at", 
				"first_name" : "Selina", "last_name" : "Brinnich", 
				"password" : "pbkdf2_sha256$20000$ga2A2x4KbZ3L$yQvhvWO5VfBmRQWNoQpHTBRmr9AHccpuDvtrmPXF4dM=", 
				"is_staff" : false, "is_prouser" : false, "is_active" : true, "is_superuser" : true, 
				"last_login" : ISODate("2015-11-23T15:19:54.653Z"), "date_joined" : ISODate("2015-10-29T09:38:28.580Z"), 
				"user_permissions" : [ ]
			},
			{ 
				"_cls" : "User", 
				"email" : "info@niklashohenwarter.com", 
				"first_name" : "Niklas", "last_name" : "Hohenwarter", 
				"password" : "pbkdf2_sha256$20000$oUSjvP6T0dHL$DUn9opAaJNdwVom9inFzTHRI3lCAKw6rIYjFbsni2uE=", 
				"is_staff" : false, "is_prouser" : false, "is_active" : true, "is_superuser" : true, 
				"last_login" : ISODate("2015-11-25T07:52:03.791Z"), "date_joined" : ISODate("2015-10-29T09:44:54.045Z"), 
				"user_permissions" : [ ]
			},
			{ 
				"_cls" : "User", 
				"email" : "thomas280697@gmail.com", 
				"first_name" : "Thomas", "last_name" : "Stedronsky", 
				"password" : "pbkdf2_sha256$20000$yzmSBijVJfCx$9CrIZM6yxikDLFNEkD2kuubVU60d+B76rlu68wgu6h0=", 
				"is_staff" : false, "is_prouser" : true, "is_active" : true, "is_superuser" : true, 
				"last_login" : ISODate("2015-11-25T08:16:59.421Z"), "date_joined" : ISODate("2015-10-29T10:12:25.667Z"), 
				"user_permissions" : [ ]
			},
			{ 
				"_cls" : "User", 
				"email" : "akaric@student.tgm.ac.at", 
				"first_name" : "Adin", "last_name" : "Karic", 
				"password" : "pbkdf2_sha256$20000$e8L1VCJcwGkG$hQPFdZYTPAoiSvErK/IAX1EzScbWBSpTCiVE5q6rWLE=", 
				"is_staff" : false, "is_prouser" : true, "is_active" : true, "is_superuser" : true, 
				"last_login" : ISODate("2015-11-25T07:22:18.140Z"), "date_joined" : ISODate("2015-10-29T10:21:56.637Z"), 
				"user_permissions" : [ ] 
			},
			{ 
				"_cls" : "User", 
				"email" : "philippadler13@gmail.com", 
				"first_name" : "Philipp", "last_name" : "Adler", 
				"password" : "pbkdf2_sha256$20000$89Zr2BO4xz5T$KAdkc6sLTcXHdEArWbxZYSvB8SWDq6DUeZzwk7ZuNzY=", 
				"is_staff" : false, "is_prouser" : true, "is_active" : true, "is_superuser" : true, 
				"last_login" : ISODate("2015-11-25T08:14:38.507Z"), "date_joined" : ISODate("2015-10-29T09:49:12.705Z"), 
				"user_permissions" : [ ]
			}
		]
}

// Init Connection
conn = new Mongo();
db = conn.getDB("testy");

// Drop Collections
db.time_table.drop();

db.notebook.drop();

db.user.drop();

// Insert example data
initJson();
for x in timetables:
	var data = JSON.parse(x)
	db.time_table.insert(data);

for x in notebooks:
	data = JSON.parse(x);
	db.notebook.insert(data);

for x in users:
	data = JSON.parse(x);
	db.user.insert(data);