class Light {
  constructor(light, appendTo) {
    this.lightID = light[0];
    this.icon = icons[light[1].config.archetype];
    this.name = light[1].name;
    this.state = {
      on: light[1].state.on,
      bri: light[1].state.bri,
      hue: light[1].state.hue,
      sat: light[1].state.sat,
    };
    this.lightMode = "";
  }
  getlightID() {return this.lightID;}
  getIcon() {return this.icon;}
  addToHtml(address) {
    const nameInWords = this.name.split(" ");

    let overflowed = false;
    
    nameInWords.forEach(word => {
      // not really the good way to use 14 here, because e.g. "i" is way smaller than "m"
      if (word.length > 14) overflowed = true;
    });

    let nameSpans = "";
    
    if (!overflowed) {
      nameInWords.forEach(word => nameSpans += `<span class="word">${word}</span>`);
    } else {
      this.name.split("").forEach(letter => {
        if (letter === " ") {
          nameSpans += `<span>&nbsp</span>`;
        } else {
          nameSpans += `<span>${letter}</span>`;
        }
      });
    }


    let lightDiv = document.createElement("div");

    lightDiv.innerHTML += `
      <div class="light" id="light${this.getlightID()}">
        <div class="gradient">
          <div class="top">
            <svg class="icon" viewBox="0 0 32 32">
              ${this.getIcon()}
            </svg>
            <div class="lightName">
              ${nameSpans}
            </div>
          </div>
          <div class="bottom">
            <label class="toggle">
              <input class="switcher" type="checkbox">
            </label>
          </div>
        </div>
      </div>
    `;

    document.querySelector(address).appendChild(lightDiv.childNodes[1]);

    this.addEventListeners();
    this.renderState();
  }
  addEventListeners() {
    let checkBox = this.getDomAdress().querySelector(".switcher");

    checkBox.addEventListener("click", () => {
      this.state.on = checkBox.checked;
      this.renderState();
      this.sendState();
    });
  }
  getDomAdress() {
    return document.querySelector(`#light${this.getlightID()}`);
  }
  setState(newMode, newState) {
    // newState is an object;
    this.lightMode = newMode;
    this.state = newState;
    this.renderState();
  }

  renderState() {
    /* render the color */
    let color = {
      r: 39,
      g: 39,
      b: 39,
    };
    if (this.state.on) {
      if (this.lightMode === "xy") {
        console.log(this.state);
        color = colorMath.XYtoRGB(this.state);
      } else if (this.lightMode === "ct") {
        //TODO

      } else {
        color = colorMath.HSVtoRGB(this.state);

      }
    }

    this.getDomAdress().setAttribute("style", `background: rgb(${color.r},${color.g},${color.b})`);
    
    
    let primeColor = "var(--white)";
    if (this.state.bri > 127 && this.state.on) {
      primeColor = "var(--black)";
    }

    this.getDomAdress().querySelector(".icon").setAttribute("style", `fill: ${primeColor}`);
    this.getDomAdress().querySelectorAll("span").forEach(span => span.setAttribute("style", `color: ${primeColor}`));
    
    /* render the toggle*/
    const checkBox = this.getDomAdress().querySelector(".switcher");
    checkBox.checked = this.state.on;
  }


  sendState() {
    doHTML("PUT", `{
      "on": ${this.state.on},
      "bri": ${this.state.bri},
      "sat": ${this.state.sat},
      "hue": ${this.state.hue}
    }`, `lights/${this.lightID}/state/`);
  }

}

class Scene {
  constructor(sceneID, scene) {
    this.sceneID = sceneID;
    this.name = scene.name;
    this.lights = Object.entries(scene.lightstates).map(light => {
      let lightEntry = {
        lightID: light[0],
        state: {
          on: light[1].on
        }
      };
      // there are some various ways, a light can store data
      if (light[1].on === false) {
        lightEntry.lightMode = "off";

      } else if (light[1].xy !== undefined) {
        lightEntry.lightMode = "xy";
        lightEntry.state.bri= light[1].bri;
        lightEntry.state.x = light[1].xy[0];
        lightEntry.state.y = light[1].xy[1];
        
      } else if (light[1].ct !== undefined) {
        lightEntry.lightMode = "ct";
        //TODO
      }
      return lightEntry;
    });
  }
  getSceneID() {return this.sceneID;}
  getName() {return this.name;}
  getDomAdress() {
    return document.querySelector(`#scene${this.getSceneID()}`);
  }
  
  renderState() {
    // get the colors
    let gradientColors = [];

    // just pushes the possible colors
    this.lights.forEach(light => {
      if (light.lightMode === "xy") {
        gradientColors.push(colorMath.XYtoRGB(light.state));
      } else if (light.lightMode === "ct") {
        //TODO
      }
    });

    gradientColors = colorMath.sortRGBvalues(gradientColors);
    // console.log(gradientColors);

    let gradient = "";

    for (let a = 0; a < gradientColors.length; a++) {
      const color = gradientColors[a];
      gradient += `,rgb(${color.r},${color.g},${color.b}) ${a * (100 / (gradientColors.length - 1))}%`;
    }
    
    // set the gradient
    this.getDomAdress().querySelector(".sceneGradient").setAttribute("style", `background-image: linear-gradient(90deg${gradient})`);
  }

  addEventListeners() {
    this.getDomAdress().addEventListener("click", () => {
      this.activateScene();
    });
  }

  addToHtml(address) {
    const nameInWords = this.name.split(" ");

    let overflowed = false;
    
    nameInWords.forEach(word => {
      // not really the good way to use 14 here, because e.g. "i" is way smaller than "m"
      if (word.length > 14) overflowed = true;
    });

    let nameSpans = "";
    
    if (!overflowed) {
      nameInWords.forEach(word => nameSpans += `<span class="word">${word}</span>`);
    } else {
      this.name.split("").forEach(letter => {
        if (letter === " ") {
          nameSpans += `<span>&nbsp</span>`;
        } else {
          nameSpans += `<span>${letter}</span>`;
        }
      });
    }


    let sceneDiv = document.createElement("div");
    
    sceneDiv.innerHTML = `
      <div class="scene" id="scene${this.getSceneID()}">
        <div class="sceneName">
          ${nameSpans}
        </div>
        <div class="sceneGradient">
          <div class="blurEffect"></div>
        </div>
      </div>
      `;
      
      document.querySelector(address).appendChild(sceneDiv.childNodes[1]);

      this.addEventListeners();
      this.renderState();
  }
  activateScene() {
    this.lights.forEach(lightInScene => {
      allLights.find(lightInAll => lightInAll.getlightID() === lightInScene.lightID).setState(lightInScene.lightMode, lightInScene.state);
    });

    doHTML("PUT", `{
      "scene": "${this.sceneID}"
    }`, `groups/0/action`);
  }
}

class Group {
  constructor(group) {
    this.groupID = group[0];
    this.name = group[1].name;
    this.lightIDs = group[1].lights;
    this.icon = icons[group[1].class];
    this.type = group[1].type;
    this.state = {
      on: group[1].action.on,
      bri: group[1].action.bri,
    };
    // console.log(this.state);
  }
  getGroupID() {}
  getName() {}
  getLightIDs() {}
  getIcon() {}
  getType() {}
  getDomAdress() {
    return document.querySelector(`#group${this.groupID}`);
  }

  addToHtml(address) {
    let groupDiv = document.createElement("div");

    groupDiv.innerHTML += `
      <div class="zone" id="group${this.groupID}">
        <div class="blurEffect">
          <div class="top">
          
          <span class="zoneName">${this.name}</span>
          
          <label class="toggleSmall">
            <input class="switcher" type="checkbox">
          </label>
          
          </div>
          <div class="slider">
            <div class="progress"></div>
            <div class="sliderShadow"></div>
            <input min="1" max="254" value="${this.state.bri}" type="range">
          </div>
        </div>
      </div>
    `;

    document.querySelector(address).appendChild(groupDiv.childNodes[1]);

    this.addEventListeners();
    this.renderState();
  }
  
  addEventListeners() {
    const checkBox = this.getDomAdress().querySelector(".switcher");

    checkBox.addEventListener("click", () => {
      this.state.on = checkBox.checked;
      this.renderState();
      this.sendState();
    });

    const slider = this.getDomAdress().querySelector(".slider");

    slider.addEventListener("input", () => {
      this.state.bri = slider.querySelector("input[type=range]").value;
      this.renderState();
      throttle(() => this.sendState());
    });
  }

  renderState() {
    /* render the color of the card */
    let gradientColors = [];

    // just pushes the possible colors
    this.lightIDs.forEach(lightID => {
      // get the light that is reffrered to in the group
      const thisLight = allLights.find(light => light.lightID === lightID);

      gradientColors.push(colorMath.RGBmaxSaturation(colorMath.HSVtoRGB(thisLight.state, true)));
    });

    gradientColors = colorMath.sortRGBvalues(gradientColors);

    let gradient = "";
    
    for (let a = 0; a < gradientColors.length; a++) {
      const color = gradientColors[a];
      gradient += `,rgb(${color.r},${color.g},${color.b}) ${a * (100 / (gradientColors.length - 1))}%`;
    }

    let darkness = `linear-gradient(180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, ${map(this.state.bri, 1, 254, 0.13, 0)}) 3.67%,
      rgba(0, 0, 0, ${map(this.state.bri, 1, 254, 0.28, 0)}) 11.11%,
      rgba(0, 0, 0, ${map(this.state.bri, 1, 254, 0.42, 0.04)}) 22.22%,
      rgba(0, 0, 0, ${map(this.state.bri, 1, 254, 0.52, 0.08)}) 33.33%,
      rgba(0, 0, 0, ${map(this.state.bri, 1, 254, 0.61, 0.16)}) 50%,
      rgba(0, 0, 0, ${map(this.state.bri, 1, 254, 0.66, 0.24)}) 66.67%,
      rgba(0, 0, 0, ${map(this.state.bri, 1, 254, 0.70, 0.45)}) 100%
    )`;


    // set the gradient
    this.getDomAdress().setAttribute("style", `background-image: linear-gradient(90deg${gradient})`);
    // the dark part has to be above the blur
    this.getDomAdress().querySelector(".blurEffect").setAttribute("style", `background-image: ${darkness}`);


    /* render the toggle */
    /* render the toggle*/
    const checkBox = this.getDomAdress().querySelector(".switcher");
    checkBox.checked = this.state.on;


    /* render the slider */
    const slider = this.getDomAdress().querySelector(".slider");
    const range = slider.querySelector("input[type=range]");
    const prog = slider.querySelector(".progress");

    const width = Math.max(slider.offsetWidth / range.max * range.value, 10);

    prog.style.width = `${width}px`;
    prog.style["margin-right"] = `${0-width}px`;
  }

  sendState() {
    doHTML("PUT", `{
      "on": ${this.state.on},
      "bri": ${this.state.bri},
      "transitiontime": 5
    }`, `groups/${this.groupID}/action`);
  }

}