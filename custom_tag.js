const tag = document.createElement("hl");

  function HL(label) {
    tag.setAttribute("label", label);
    // label 속성값
    switch (label) {
      case "1":
        tag.style.fontWeight = "bold";
        tag.style.fontSize = "2em";
        break;
      case "2":
        tag.style.fontWeight = "bold";
        tag.style.fontSize = "1.5em";
        break;
      case "3":
        tag.style.fontWeight = "bold";
        tag.style.fontSize = "1.17em";
        break;
      case "4":
        tag.style.fontWeight = "bold";
        tag.style.fontSize = "1em";
        break;
      case "5":
        tag.style.fontWeight = "bold";
        tag.style.fontSize = "0.83em";
        break;
      case "6":
        tag.style.fontWeight = "bold";
        tag.style.fontSize = "0.67em";
        break;
    }

    return tag;
  }

  document.querySelector("body").appendChild(HL("1"));
  document.querySelector("body").appendChild(HL("2"));
  document.querySelector("body").appendChild(HL("3"));
  document.querySelector("body").appendChild(HL("4"));
  document.querySelector("body").appendChild(HL("5"));
  document.querySelector("body").appendChild(HL("6"));
