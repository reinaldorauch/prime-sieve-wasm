use std::time::Instant;

use prime_sieve_lib::PrimeSieve;

fn run_for_5_secs() -> (u32, f32) {
    let mut passes = 0u32;

    let start = Instant::now();

    while Instant::now().duration_since(start).as_secs_f32() < 5.0 {
        PrimeSieve::new(1_000_000).run_sieve().count_primes();
        passes += 1;
    }

    (passes,  Instant::now().duration_since(start).as_secs_f32())
}

fn main() {
    let thread_count = 16u8;

    let mut threads = Vec::new();

    for _ in 0..thread_count.into() {
        let t = std::thread::spawn(run_for_5_secs);
        threads.push(t);
    }

    let mut passes = 0;
    let mut time = 0.0;

    for t in threads {
        let (t_passes, t_time) = t.join().expect("Could not join thread");
        passes += t_passes;
        if t_time > time {
            time = t_time;
        }
    };

    println!("Passes: {}, time: {}", passes, time);
}