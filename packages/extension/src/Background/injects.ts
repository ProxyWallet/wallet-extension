// interface Window {
//     [key: string]: any;
//   }

  
// (window as Window).enkrypt = {
//     providers: {},
//     settings: {},
//   };
//   const script = document.getElementById('enkrypt-inject') as HTMLScriptElement;
//   const scriptURL = new URL(script.src);
//   window.enkrypt.settings = JSON.parse(scriptURL.searchParams.get("settings")!);
  
//   windowOnMessage(async (msg): Promise<void> => {
//     window["enkrypt"]["providers"][msg.provider].handleMessage(msg.message);
//   });