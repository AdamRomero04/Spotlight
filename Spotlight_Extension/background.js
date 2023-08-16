chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.id === 'songid') {
    songNum = message.textContent;
    sendResponse({ confirmation: "Message with specific ID received!" });

    (async () => {
      const data = {
        songID: songNum
      };
      const response = await fetch('http://127.0.0.1:5000/songID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      console.log(responseData);

      async function delayedExecution() {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      await delayedExecution();

      const fetchUrl = `http://127.0.0.1:5000/data?songNum=${encodeURIComponent(songNum)}`;
      const getResponse = await fetch(fetchUrl, {
        method: 'GET',
        mode: 'cors',
      });

      const getData = await getResponse.json();
      console.log(getData);
      getData.id = "song-data";
      chrome.tabs.query({ url: '*://open.spotify.com/*' }, function(tabs) {
        console.log(tabs)
        for (const tab of tabs) {
          chrome.tabs.sendMessage(tab.id, getData);
        }
      });
    })();
  }
});

