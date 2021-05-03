const cadres = [
  {
    libelle : "technicien"
  },
  {
    libelle : "ingenieur"
  },
  {
    libelle : "adjoint"
  }, 
  {
    libelle : "administrateur"
  }
  
]

const Cadre = require("../models/cadre")

function bookCreate(params) {
  const bookdetail = { 
    ...params
  }
    
  var cadre = new Cadre(bookdetail);    
  cadre.save(function (err) {
    if (err) {
      // alert("error")
      console.log("error"+err)
      return
    }
    console.log('New Book: ' + cadre);
  }  );
}


module.exports = cadres.forEach(c  => {

  bookCreate(c)
});
