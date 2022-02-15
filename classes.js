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
  }
  getlightID() {return this.lightID;}
  getIcon() {return this.icon;}
  addToHtml(address) {
    let checkBoxState = "";
    if (this.state.on) checkBoxState = "checked=''";

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

    document.querySelector(address).innerHTML += `
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
              <input class="switcher" type="checkbox" ${checkBoxState}>
            </label>
          </div>
        </div>
      </div>
    `;

    // add the color
    this.renderState();
  }
  addEventListeners() {
    let checkBox = this.getDomAdress().querySelector(".switcher");

    checkBox.addEventListener("click", () => {
      this.lightSwitch(checkBox.checked);
    });
  }
  getDomAdress() {
    return document.querySelector(`#light${this.getlightID()}`);
  }

  lightSwitch(isOn) {
    this.state.on = isOn;
    this.renderState();
    this.sendState();
  }

  renderState() {
    // get the color
    let color = {
      r: 39,
      g: 39,
      b: 39,
    };
    if (this.state.on) color = colorMath.HSVtoRGB(this.state);

    this.getDomAdress().setAttribute("style", `background: rgb(${color.r},${color.g},${color.b})`);
    
    
    let primeColor = "#FFFFFF";
    if (this.state.bri > 127 && this.state.on) {
      primeColor = "#181818";
    }
    this.getDomAdress().querySelector(".icon").setAttribute("style", `fill: ${primeColor}`);
    this.getDomAdress().querySelectorAll("span").forEach(span => span.setAttribute("style", `color: ${primeColor}`));
    
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
    console.log(gradientColors);

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
      console.log("HI");
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

    document.querySelector(address).innerHTML += `
      <div class="scene" id="scene${this.getSceneID()}">
        <div class="sceneName">
          ${nameSpans}
        </div>
        <div class="sceneGradient">
          <div class="blurEffect"></div>
        </div>
      </div>
    `;

    this.renderState();
  }
  activateScene() {
    doHTML("PUT", `{
      "scene": "${this.sceneID}"
    }`, `groups/0/action`);
  }
}
