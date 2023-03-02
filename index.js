import init, { greet, prime_sieve } from "./pkg/prime_sieve_lib.js";

/**
 * Selects an element in the context
 * @param s {String} css selector
 * @param c {HTMLElement}
 * @returns {HTMLElement}
 */
const $ = (s, c = document) => c.querySelector(s)

init().then(() => {
    const e = $('#run');
    e.addEventListener('click', async () => {
        e.disabled = true;
        e.textContent = "Running...";

        const result = await new Promise((res, rej) => {
            try {
                res(prime_sieve(1_000_000));
            } catch (err) {
                rej(err);
            }
        });

        $('#output').textContent = 'Result: ' + result;

        e.textContent = "Run!";
        e.disabled = false;
    });

    const fiveSecs = $("#run_5_secs");

    fiveSecs.addEventListener("click", async () => {
        fiveSecs.disabled = true;
        fiveSecs.textContent = "Running...";

        // 15 because the main tread also counts
        const { passes, time } = (await Promise.all(Array.from(Array(16)).map(() => runSieve5secs())))
            .reduce(({ passes: sum, time: max }, { passes, time }) => ({ passes: passes + sum, time: time > max ? time : max }), { passes: 0, time: 0 });

        $("#output").textContent = $("#output").textContent + "Result (wasm): passes: " + passes + ", time: " + time + '\n';

        fiveSecs.textContent = "Run for 5 secs!";
        fiveSecs.disabled = false;
    })

    const fiveSecsPlain = $("#run_5_secs_plain");

    fiveSecsPlain.addEventListener("click", async () => {
        fiveSecsPlain.disabled = true;
        fiveSecsPlain.textContent = "Running...";

        // 15 because the main tread also counts
        const { passes, time } = (await Promise.all(Array.from(Array(16)).map(() => runSievePlain5secs())))
            .reduce(({ passes: sum, time: max }, { passes, time }) => ({ passes: passes + sum, time: time > max ? time : max }), { passes: 0, time: 0 });

        $("#output").textContent = $("#output").textContent + "Result (plain): passes: " + passes + ", time: " + time + '\n';

        fiveSecsPlain.textContent = "Run for 5 secs!";
        fiveSecsPlain.disabled = false;
    })

    $('#alert').addEventListener("click", () => greet("reinaldo"));

    function runSieve5secs() {
        return new Promise((res, rej) => {
            const worker = new Worker("./sieve-worker.js", { type: "module" });
            worker.addEventListener("message", (ev) => {
                res(ev.data)
                worker.terminate();
            });
            worker.addEventListener("error", err => rej(err));
        });
    }

    function runSievePlain5secs() {
        return new Promise((res, rej) => {
            const worker = new Worker("./sieve-worker-plain.js", { type: "module" });
            worker.addEventListener("message", (ev) => {
                res(ev.data)
                worker.terminate();
            });
            worker.addEventListener("error", err => rej(err));
        });
    }
});