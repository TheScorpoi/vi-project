function changeChart() {
    console.log(document.getElementById("toggle").checked)
    var x = document.getElementById("svg1");
    var y = document.getElementById("svg2");
    if (x.style.display === "none") {
        if(y != null)
            y.style.display = "none";
            document.getElementById("mapTitle2").style.display = "none";
        x.style.display = "block";
        document.getElementById("mapTitle").style.display = "block";
    } else {
        x.style.display = "none";
        document.getElementById("mapTitle").style.display = "none";
        if(y != null)
            y.style.display = "block";
            document.getElementById("mapTitle2").style.display = "block";
    }
  }
