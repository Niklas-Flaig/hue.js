class Light {
  constructor(light, appendTo) {
    this.number = light[0];
    this.icon = icons[light[1].config.archetype];
    this.name = light[1].name;
    this.state = {
      on: light[1].state.on,
      bri: light[1].state.bri,
      hue: light[1].state.hue,
      sat: light[1].state.sat,
    };
  }
  getNumber() {return this.number;}
  getIcon() {return this.icon;}
  setOnState(isOn) {this.state.on = isOn;}
  getColor() {
    let color = HSVtoRGB(this.state);
    // console.log(`rgb(${color.r},${color.g},${color.b})`);
    return `rgb(${color.r},${color.g},${color.b})`;
  }
  getHTMLtext() {
    let checkBoxState = "";
    if (this.state.on) checkBoxState = "checked=''";

    let nameSpans = "";
    this.name.split(" ").forEach(word => nameSpans += `<span>${word}</span>`);

    return `
      <div class="light" id="light${this.getNumber()}">
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
  }
  getDomAdress() {
    return document.querySelector(`#light${this.getNumber()}`);
  }
  renderColor() {
    // get the color
    let color = HSVtoRGB(this.state);

    // check if the lights on or of
    if (this.state.on) {
      this.getDomAdress().setAttribute("style", `background: rgb(${color.r},${color.g},${color.b})`);
    } else {
      this.getDomAdress().setAttribute("style", "background: #272727");
    }

  }

  lightSwitch() {
    doHTML("PUT", `{"on": ${this.state.on}}`, `lights/${this.number}/state/`);
    this.state.on = !this.state.on;
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
          on: light[1].on
        },
      };
    });
  }
  getSceneID() {return this.sceneID;}
  getName() {return this.name;}

  addToHtml(address) {
    let nameSpans = "";
    this.name.split(" ").forEach(word => nameSpans += `<span>${word}</span>`);

    document.querySelector(address).innerHTML += `
      <div class="scene">
        <div class="sceneName">
          ${nameSpans}
        </div>
        <div class="sceneGradient"></div>
      </div>
    `;
  }
}
