import React, { useEffect } from "react";

const AdsterraBanner = () => {
  useEffect(() => {
    // Adsterra settings
    window.atOptions = {
      key: "4782c921a02d801996390d6bd797af33",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    // Script tag create
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//www.highperformanceformat.com/4782c921a02d801996390d6bd797af33/invoke.js";
    document.getElementById("ad-container").appendChild(script);

    // Cleanup
    return () => {
      document.getElementById("ad-container").innerHTML = "";
    };
  }, []);

  return (
    <div
      id="ad-container"
      style={{
        width: "300px",
        height: "250px",
        margin: "0 auto",
      }}
    ></div>
  );
};

export default AdsterraBanner;
