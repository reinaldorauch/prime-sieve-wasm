import init, { prime_sieve } from "./pkg/prime_sieve_lib.js";

(function () {
    "use strict";

    init().then(() => {
        let passes = 0;
    
        const start = Date.now();
    
        console.log("Start sieving");
        for (passes = 0; (Date.now() - start) < 5000; passes++) {
            prime_sieve(1_000_000);
        }
    
        console.log("Done sieving");
        postMessage({ passes, time: Date.now() - start});
    });
})();