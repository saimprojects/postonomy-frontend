import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key' : '4782c921a02d801996390d6bd797af33',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = "//www.highperformanceformat.com/4782c921a02d801996390d6bd797af33/invoke.js";
    document.body.appendChild(script2);

    return () => {
      script1.remove();
      script2.remove();
    };
  }, []);

  return (
    <div>
      <h2>Advertisement</h2>
      <div id="ad-container"></div>
    </div>
  );
}
