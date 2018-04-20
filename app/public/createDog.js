$(document).ready(function( {
  const dogName = $("#dogName");
  const dogAge = $("#dogAge");
  const submit = $("#submitButton");
  submit.addEventListener("click", function() {
    console.log(dogName);
    console.log(dogAge);
  })
}))
