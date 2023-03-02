class PrimeSieve {
    size = 0;
    bits = undefined;

    constructor(size) {
        this.size = size;
        this.bits = new Uint8Array(Math.floor(size / 2));

        for (let i = 0; i < Math.floor(size / 2); i++) {
            this.bits[i] = true;
        }
    }

    get(num) {
        if (num % 2 == 0) return false;
        return this.bits[Math.floor(num / 2)];
    }

    clear(num) {
        if (num % 2 == 0) return false;
        this.bits[Math.floor(num / 2)] = false;
    }

    run_sieve() {
        let factor = 3;
        const q = Math.sqrt(this.size);

        while (factor < q) {
            for (let i = factor; i < this.size; i++) {
                if (this.get(i)) {
                    factor = i;
                    break;
                }
            }

            for (let i = factor * 3; i < this.size; i += 2) {
                this.clear(i);
            }

            factor += 2;
        }

        return this;
    }

    count_primes() {
        let counter = 1;

        for (let i = 3; i < this.size; i += 2) {
            if (this.get(i)) counter++;
        }

        return counter;
    }
}

function prime_sieve(size) {
    (new PrimeSieve(size)).run_sieve().count_primes();
}

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    // worker, so no shim to postMessage
} else {
    window.postMessage = function postMessage(data) {
        console.log(JSON.stringify(data))
    }
}

(function () {
    "use strict";

    let passes = 0;
    
    const start = Date.now();

    console.error("Start sieving");
    for (passes = 0; (Date.now() - start) < 5000; passes++) {
        prime_sieve(1_000_000);
    }

    console.error("Done sieving");
    postMessage({ passes, time: Date.now() - start});
})();
