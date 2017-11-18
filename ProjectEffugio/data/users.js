var bcrypt = require('bcryptjs');

var users = [
  { id: "1245325124124", username: "masterdetective123",hashedPassword: "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.", firstName: "Sherlock", lastName: "Holmes", profession: "Detective",
  bio: "Sherlock Holmes is a fictional private detective created by British author Sir Arthur Conan Doyle. Known as a \"consulting detective\" in the stories, Holmes is known for a proficiency with observation, forensic science, and logical reasoning that borders on the fantastic, which he employs when investigating cases for a wide variety of clients, including Scotland Yard."
}, 
  { id: "723445325124124", username: "lemon", hashedPassword: "$2a$16$SsR2TGPD24nfBpyRlBzINeGU61AH0Yo/CbgfOlU1ajpjnPuiQaiDm", firstName: "Elizabeth", lastName: "Lemon", profession: "Writer" ,bio:"Elizabeth Miervaldis \"Liz\" Lemon is the main character of the American television series 30 Rock. She created and writes for the fictional comedy-sketch show The Girlie Show or TGS with Tracy Jordan."},
{ id:"923445325124124",username: "theboywholived",firstName: "Harry",lastName: "Potter",profession: "Student"
,bio: "Harry Potter is a series of fantasy novels written by British author J. K. Rowling. The novels chronicle the life of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry . The main story arc concerns Harry's struggle against Lord Voldemort, a dark wizard who intends to become immortal, overthrow the wizard governing body known as the Ministry of Magic, and subjugate all wizards and Muggles.",
  hashedPassword:"$2a$16$4o0WWtrq.ZefEmEbijNCGukCezqWTqz1VWlPm/xnaLM8d3WlS5pnK"}];
  

exports.findById = function(id, cb) {
  process.nextTick(function() {
    for (var i = 0, len = users.length; i < len; i++) {
      var record = users[i];
      if (record.id === id) {
        return cb(null, record);
      }
    }
    return cb(new Error('User ' + id + ' does not exist'));
  });
}
      
exports.findByUsername = function(username, cb) {
        process.nextTick(function() {
          for (var i = 0, len = users.length; i < len; i++) {
            var record = users[i];
            if (record.username === username) {
              return cb(null, record);
            }
          }
          return cb(null, null);
        });
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
