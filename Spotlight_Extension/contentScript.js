function Main() {

  const songArray = [];
  let bottomBarPlacement = '';
  let currentTime = 0;
  let previousTime = 0;
  let timerInterval = null;
  let songSpot = 0;
  let isAdjustingSongSpot = false;
  let trackColor = 0;
  let messageColor = 0;
  let colorThief = new ColorThief();
  const timeline = gsap.timeline();
  timeline.pause();
 
  bottomBarPlacement = document.getElementsByClassName('deomraqfhIAoSB3SgXpu');
  if (bottomBarPlacement.length > 0) {
    clearInterval(interval);
  }
  else{
    return;
  }
  const pipButton = document.createElement('button');
  pipButton.innerText = 'Enter PiP';
  bottomBarPlacement[0].appendChild(pipButton); 
 
  async function loadCustomFont() {
    const preFont = document.createElement("link");
    preFont.rel = "preconnect";
    preFont.href = "https://fonts.googleapis.com";
  
  
    const preFont1 = document.createElement("link");
    preFont1.rel = "preconnect";
    preFont1.href = "https://fonts.gstatic.com";
    preFont1.crossOrigin = "anonymous";
  
  
    const Montserrat = document.createElement('link');
    Montserrat.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap";
    Montserrat.rel = "stylesheet";
    document.head.append(preFont);
    document.head.append(preFont1);
    document.head.append(Montserrat);
    const fontURL = 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2';
    const font = new FontFace('Montserrat', `url(${fontURL})`);
    await font.load();
    document.fonts.add(font);
  }
 async function loadFont(){
    await loadCustomFont();
 }
 
 
  function lightOrDark(color) {
 
 
    // Variables for red, green, blue values
    let r, g, b, hsp;
   
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
 
 
        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
       
        r = trackColor[0];
        g = trackColor[1];
        b = trackColor[2];
    }
    else {
       
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));
 
 
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
   
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );
 
 
    // Using the HSP value, determine whether the color is light or dark
    if (hsp>127.5) {
 
 
        return 'light';
    }
    else {
 
 
        return 'dark';
    }
 }
 
 
  async function createBase(currentSongImg){
    await loadFont();
    PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2;
    const app = new PIXI.Application({
      width: 900,
      height: 900,
    });
    let canvas = app.view;

    mainBackgroundImg = document.createElement('img');
    mainBackgroundImg.src = currentSongImg;
    trackColor = colorThief.getColor(mainBackgroundImg);

    let colorFormatted = `rgb(${trackColor[0]}, ${trackColor[1]}, ${trackColor[2]})`;
    let brightness = lightOrDark(colorFormatted);
 
    if(brightness == 'dark'){
      let trackPalette = colorThief.getPalette(mainBackgroundImg);
      console.log(trackPalette);
      let paletteBrightness = 0;
      for(let i = 0; i < trackPalette.length; i++){
        let paletteColorFormatted = `rgb(${trackPalette[i][0]}, ${trackPalette[i][1]}, ${trackPalette[i][2]})`;
        trackColor[0] = trackPalette[i][0];
        trackColor[1] = trackPalette[i][1];
        trackColor[2] = trackPalette[i][2];
 
 
        paletteBrightness = lightOrDark(paletteColorFormatted);
        console.log(paletteBrightness)
        if(paletteBrightness == 'light'){
          console.log(trackColor)
          break;
        }
      }
      if (paletteBrightness == 'dark'){
        trackColor[0] = messageColor.substring(1, 3);
        trackColor[1] = messageColor.substring(3, 5);
        trackColor[2] = messageColor.substring(5, 7);
        console.log(trackColor)
      }
    }
    colorThief = null;
 
    const texture = PIXI.Texture.from(currentSongImg);
    const backgroundSprite = new PIXI.Sprite(texture);
    backgroundSprite.width = app.view.width;
    backgroundSprite.height = app.view.height;
    backgroundSprite.anchor.set(0.5);
    backgroundSprite.position.set(app.view.width / 2, app.view.height / 2);
    app.stage.addChild(backgroundSprite);

    const canvasGrad = document.createElement('canvas');
    canvasGrad.width = 900;
    canvasGrad.height = 900;
    const ctx = canvasGrad.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 900);
    gradient.addColorStop(0, 'rgba(0, 0, 0, .75)');
    gradient.addColorStop(0.2, 'rgba(0, 0, 0, .525)');
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, .3)');
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, .3)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, .525)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, .75)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 900); //137 - 165 creates blur and gradient
    const gradTexture = PIXI.Texture.from(canvasGrad);
    const gradientSprite = new PIXI.Sprite(gradTexture);
    gradientSprite.position.set(0, 0);
    gradientSprite.width = 900;
    gradientSprite.height = 900;
     const blurFilter1 = new PIXI.BlurFilter();
    blurFilter1.blur = 15;
    backgroundSprite.filters = [blurFilter1];
    app.stage.addChild(gradientSprite);
   
    const mask = new PIXI.Graphics();
    mask.beginFill(0xFFFFFF);
    mask.drawRoundedRect(0, 0, 60, 60,5);
    mask.endFill();
 
 
    const smallBackgroundSprite = new PIXI.Sprite(texture);
    smallBackgroundSprite.width = 60;
    smallBackgroundSprite.height = 60;
    smallBackgroundSprite.position.set(7.5, 7.5);
    smallBackgroundSprite.mask = mask;
    mask.position.set(7.5, 7.5);
    app.stage.addChild(smallBackgroundSprite);
    app.stage.addChild(mask);
 
 
    const textStyle = new PIXI.TextStyle({
      fontFamily: 'Montserrat',
      fontSize: 15,
      fontWeight: 700,
      fill: `rgba(${trackColor[0]}, ${trackColor[1]}, ${trackColor[2]}, .4)`, // Text color
    });
    const text = new PIXI.Text('Lyrics provided by Musixmatch', textStyle);
    text.position.set((900 - text.width) / 2, 855);
    app.stage.addChild(text);
 
 
    let songTitleSrc = document.querySelector('[data-testid="context-item-link"]').textContent;
    let songArtistSrc = document.querySelector('[data-testid="context-item-info-subtitles"]');
    spanList = songArtistSrc.querySelectorAll('span');
    let spanTexts = Array.from(spanList).map(span => span.textContent);
    let combinedText = spanTexts.join('');
    if(songTitleSrc.length > 40){
      songTitleSrc = songTitleSrc.substring(0, 39) + '...';
    }
    if(combinedText.length > 46){
      combinedText = combinedText.substring(0, 45) + '...';
    }
 
 
    const songTitleTextStyle = new PIXI.TextStyle({
      fontFamily: 'Montserrat',
      fontSize: 30,
      fontWeight: 700,
      fill: 'rgb(255, 255, 255)', // Text color
    });
    const titleName = new PIXI.Text(songTitleSrc, songTitleTextStyle);
    titleName.position.set(80, 2.5);
     const artistNameTextStyle = new PIXI.TextStyle({
      fontFamily: 'Montserrat',
      fontSize: 20,
      fontWeight: 700,
      fill: 'rgb(255, 255, 255, .5)', // Text color
    });
    const artistName = new PIXI.Text(combinedText, artistNameTextStyle);
    artistName.position.set(82.5, 41);
    const roundedRect = new PIXI.Graphics();
    roundedRect.beginFill('rgb(0, 0, 0, .1)'); // Set the fill color
    let roundedRectWidth = 0;
    if(titleName.width > artistName.width){
      roundedRectWidth = titleName.width;
    }
    else{
      roundedRectWidth = artistName.width;
    }
    roundedRect.drawRoundedRect(55, 7.5, 35 + roundedRectWidth, 60, 10); // Adjust position, width, height, and radius
    roundedRect.endFill();
    const blurFilterRect = new PIXI.BlurFilter();
    blurFilterRect.blur = 3;
    roundedRect.filters = [blurFilterRect];
    app.stage.addChild(roundedRect);
    app.stage.addChild(smallBackgroundSprite);
    app.stage.addChild(mask);
    app.stage.addChild(titleName);
    app.stage.addChild(artistName);

    const textStyleBaseWords = new PIXI.TextStyle({
      fontFamily: 'Montserrat',
      fontSize: 70,
      fontWeight: 700,
      fill: `rgb(${trackColor[0]}, ${trackColor[1]}, ${trackColor[2]}, .7)`,
      wordWrap: true,
      wordWrapWidth: 750
    });


    const innerLyricTextBox = new PIXI.Container();
    innerLyricTextBox.width = 750;
    innerLyricTextBox.height = 750;
    innerLyricTextBox.position.set(75, 75);
 
    const mask1 = new PIXI.Graphics();
    mask1.beginFill(0xFFFFFF);
    mask1.drawRect(75, 75, 750, 750);
    mask1.endFill();
    innerLyricTextBox.mask = mask1;

    let textBrick = new PIXI.Container();
    textBrick.width = 750;
    textBrick.position.set(0, 375);

    for(let i = 0; i < songArray.length; i++){
      let text1 = new PIXI.Text(songArray[i].words, textStyleBaseWords);
      textItemArr.push(text1);
    }

    for(let i = 0; i < songArray.length; i++){
      if(i == 0){
        const data = {
          startY: 0,
          height: textItemArr[i].height
        };
        textDataArr.push(data);
      }
      else{
        const data = {
          startY: textDataArr[i - 1].startY + textDataArr[i - 1].height + 40,
          height: textItemArr[i].height
        }
        textDataArr.push(data);
      }
    }
    console.log(textDataArr)

    for(let i = 0; i < songArray.length; i++){
      textItemArr[i].position.set(0,textDataArr[i].startY);
      textBrick.addChild(textItemArr[i]);
    }

    app.stage.addChild(innerLyricTextBox);
    app.stage.addChild(mask1);
    innerLyricTextBox.addChild(textBrick);

    let moveDelay = 0;
    let yPos = 0;
    (async () => {
      const src = chrome.runtime.getURL("gsap.min.js");
      const gsapImport = await import(src);
      gsapImport.main();
      const src1 = chrome.runtime.getURL("PixiPlugin.min.js");
      const pixiImport = await import(src1);
      pixiImport.main();
      gsapImport.registerPlugin(pixiImport);
      pixiImport.registerPIXI(PIXI);
    })();


    for(let i = 0; i < songArray.length; i++){
      if(i == 0){
        moveDelay = songArray[0].startTime;
        moveDelay /= 1000;
        let yCenter = (textDataArr[i].height / 2) * -1;
        yPos = yCenter - textDataArr[0].startY;
      }
      else{
        moveDelay = songArray[i].startTime - songArray[i - 1].startTime;
        moveDelay /= 1000;
        moveDelay -= .2;
        let yCenter = (textDataArr[i].height / 2) * -1;
        yPos = yCenter - textDataArr[i].startY;
      }
      timeline.to(textItemArr[i], {
        pixi: {
          colorize: `rgba(${trackColor[0]}, ${trackColor[1]}, ${trackColor[2]})`,
          //dropShadow: true,
          //dropShadowBlur: 6,
          //dropShadowColor: 'rgba(255, 255, 255, 0.3)',
        },
        duration: moveDelay,
        ease: "none",
      });      
      timeline.to(textItemArr[i], {
        pixi: {
          colorize: 'rgb(255, 255, 255)',
          //dropShadow: true,
          //dropShadowBlur: 9,
          //dropShadowColor: 'rgba(255, 255, 255, 0.5)',
        },
        duration: .2,
      });
      if(i != 0){
        timeline.to(textItemArr[i - 1], {
          pixi: {
            colorize: 'rgba(255, 255, 255, .4)',
            //dropShadow: true,
          },
          ease: 'power3.easeOut',
          duration: .2
        }, "<");
      }
      timeline.to(textBrick, {
        y: yPos + 375,
        duration: 0.2,
        ease: "power3.easeOut",
      }, "<");
    }
    const videoBox = document.createElement("video");
    videoBox.style.width = "900px";
    videoBox.style.height = "900px";
    videoBox.style.position = "absolute";
    videoBox.style.top = "-900px";
    videoBox.setAttribute('id', 'videoBox');
    const mediaStream = canvas.captureStream();
    videoBox.srcObject = mediaStream;
    videoBox.play();
    videoBox.addEventListener('loadedmetadata', () => {
      if (videoBox.readyState >= 2) {       
        if (videoBox.requestPictureInPicture) {
          videoBox.requestPictureInPicture();
        } 
      }
    });
  }
 
 
  pipButton.addEventListener('click', () => {
    const currentSongBlock = document.querySelector('[data-context-item-type="track"]');
    const currentTimeBlock = document.querySelector('[data-testid="playback-duration"]');
    const playButtonBlock = document.querySelector('[data-testid="control-button-playpause"]');
    const currentSongImg = document.querySelector('[data-testid="cover-art-image"]').src;
    console.log(currentSongImg)
    let songIDLink = document.querySelector('[data-testid="context-link"]').href;
    let OGsongID = songIDLink.split('%3Atrack%3A');
    OGsongID = OGsongID[OGsongID.length - 1];
     const OGIDmessage = {
       id: 'songid',
       textContent: OGsongID
     };
     chrome.runtime.sendMessage(OGIDmessage, function (response) {
       console.log("Response from background script:", response);
     });
 
 
     textItemArr = [];
     textDataArr = [];
 
 
     chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if(message.id === "song-data"){
        songArray.length = 0;
        currentTime = 0;
        songSpot = 0;
        isAdjustingSongSpot = false;
 
 
        const jsonData = message.lyrics;
        jsonData.forEach((item) => {
          const lyricsObject = {
            startTime: item.startTime,
            words: item.words
          };     
          songArray.push(lyricsObject);
        });
      }
      messageColor = message.trackColor;
      createBase(currentSongImg);
 
    });
 
 
    const songObserver = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
          currentSong = mutation.target.getAttribute('href');
          let songID = currentSong.split('%3Atrack%3A');
          songID = songID[songID.length - 1];
          const IDmessage = {
            id: 'songid',
            textContent: songID
          };
          chrome.runtime.sendMessage(IDmessage, function (response) {
            console.log("Response from background script:", response);
          });
          songArray.length = 0;
          currentTime = 0;
          songSpot = 0;
          isAdjustingSongSpot = false;
        }       
      });
    });
    const config = {
      attributes: true,
    };
    songObserver.observe(currentSongBlock, config);
    prevY = 450;
    function timerFunc() {
      if (playButtonBlock.getAttribute('aria-label') === 'Pause') {
        timeline.play();
        currentTime += 125;
        if (songArray.length > 0 && songSpot < songArray.length) {
          if (currentTime >= songArray[songArray.length - 1].startTime) {
            if (songSpot >= 0 && songSpot < songArray.length) {
              console.log(songArray[songSpot].words);
              songSpot = songArray.length;
            }
          }
          else if (currentTime >= songArray[songSpot].startTime) {
            console.log(songArray[songSpot].words);
            songSpot++;
          }
        }
      }
      else if (playButtonBlock.getAttribute('aria-label') === 'Play') {
        timeline.pause();
        clearInterval(timerInterval);
      }
      if (songSpot >= songArray.length) {
        clearInterval(timerInterval);
      }
    }
   
    const timeObserver = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-test-position') {
          previousTime = currentTime;
          currentTime = Number(mutation.target.getAttribute('data-test-position'));
   
          if (!isAdjustingSongSpot) {
            if (previousTime > currentTime && previousTime - currentTime > 1000) {
              for (let i = 0; i < songArray.length - 1; i++) {
                if (currentTime > songArray[i].startTime && currentTime < songArray[i + 1].startTime) {
                  songSpot = i;
                  isAdjustingSongSpot = true;
                  break;
                }
              }
              timeline.seek(currentTime / 1000);
            }
   
            if (previousTime < currentTime && currentTime - previousTime > 1000) {
              for (let i = 0; i < songArray.length - 1; i++) {
                if (currentTime > songArray[i].startTime && currentTime < songArray[i + 1].startTime) {
                  songSpot = i;
                  isAdjustingSongSpot = true;
                  break;
                }
              }
              if(currentTime > songArray[songArray.length - 1].startTime){
                songSpot = songArray.length - 1;
                isAdjustingSongSpot = true;
              }
              timeline.seek(currentTime / 1000);
            }
          }
   
          clearInterval(timerInterval);
          timerInterval = setInterval(timerFunc, 125);
         
          isAdjustingSongSpot = false;
        }
      });
    });
   
    const config1 = {
      attributes: true,
    };
    timeObserver.observe(currentTimeBlock, config1);
   });
 }
 
 
 const interval = setInterval(Main, 100);
 
 
 