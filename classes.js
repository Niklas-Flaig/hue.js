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

    let nameSpans = "";
    this.name.split(" ").forEach(word => nameSpans += `<span>${word}</span>`);

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
    let color;
    if (this.state.on) {
      // check if the lights on or of
      color = HSVtoRGB(this.state);
    } else {
      color = {
        r: 39,
        g: 39,
        b: 39,
      };
    }
    
    this.getDomAdress().setAttribute("style", `background: rgb(${color.r},${color.g},${color.b})`);
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
      return {
        lightID: light[0],
        state: {
          on: light[1].on,
          bri: light[1].bri,
          x: light[1].xy[0],
          y: light[1].xy[1],
        },
      };
    });
  }
  getSceneID() {return this.sceneID;}
  getName() {return this.name;}
  renderState() {
    // get the color
    let gradientColors = this.lights.map(light => {
      return XYtoRGB(light.state);
    });

    let gradient = "";

    for (let a = 0; a < gradientColors.length; a++) {
      const color = gradientColors[a];
      gradient += `,rgb(${color.r},${color.g},${color.b}) ${a * (100 / (gradientColors.length - 1))}%`;
    }
    console.log(gradient);
    
    // set the gradient
    this.getDomAdress().querySelector(".sceneGradient").setAttribute("style", `background-image: linear-gradient(90deg${gradient})`);
  }

  addToHtml(address) {
    let nameSpans = "";
    this.name.split(" ").forEach(word => nameSpans += `<span>${word}</span>`);

    document.querySelector(address).innerHTML += `
      <div class="scene" id="scene${this.getSceneID()}">
        <div class="sceneName">
          ${nameSpans}
        </div>
        <div class="sceneGradient"></div>
      </div>
    `;

    this.renderState();
  }
}
