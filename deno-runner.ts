
const processes = Array.from(Array(16)).map(() =>
    Deno.run({
        cmd: ['deno', 'run', './sieve-worker-plain.js'],
        stdout: "piped",
    }));

const results = await Promise.all(processes);
const outputs = await Promise.all(results.map(r => r.output()));
const {passes, time} = outputs.map(o => JSON.parse(new TextDecoder().decode(o))).reduce((
    {passes: sum, time: max}, {passes, time}
) => {
    return {passes: passes+sum, time: time > max ? time : max};
}, {passes:0, time:0});

console.log("Passes: ", passes, "time: ", time/1000);