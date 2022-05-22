# hue.js
## About
**hue.js** is a website, to controll your philips-hue-bridge.
That means, you can turn the lights on and off and do all the other stuff, that's possible in the hue-app. (To see the currently implemented features, look it up at the Feature-List)

*This Project isn't associated in any way with the Signify or Philips Hue. It's just for personal use and respect!*
- - -
## Install
In order to run this project, you need a philips-hue-bridge, with smart light-bulbsand the philips-hue-app. You have to be in the same network as the bridge or 

You also need an username, how to get such one is documented on the [Philips hue developer site](https://developers.meethue.com/develop/get-started-2/)

If you have all these things, you can start to do this:

1. Download this repo
2. Add a javaScript file to the folder named **env.js**
3. Add this code to the file
```
const env = {
  ipAdress: "xxx.xxx.xxx.xxx",
  key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
};
```
4. Insert the bridges ipAdress into **ipAdress** and the username you got from your bridge into **key**
5. Open the **hue.html** in your browser
- - -
## Feature-List
### Hardware Support
I've only been able to test my own system (hue-bridge, hue E-27-lamps and lightStrips).
So i don't know to what point using lamps from other manufacturers or even other hue-lamps will work.
### Website
- turn on and off individual *Lights*
- tur on and off *Groups* and *Rooms*
- dimm *Groups* and *Rooms*
- activate the scenes stored on your hue-bridge (so all your selfcreated scenes and stored scenes from the gallery)

I know that doesn't seem to be much, but it is!
- - -
## Licensing
I'm sorry idk, what license i can give this project, so here is, what i'm ok with.

1. Use it to controll your lights
2. Use it to controll someone elses lights
3. Develop and add new features for yourselve
4. Develop and add new features and create pull-requests
5. Use code from this repo for your own projects

Not cool is, when you use it to:
1. Gain money with it (not cool)
2. Flex in front of people without mentioning me ;]
3. Criticise this README

**T. HANKS**