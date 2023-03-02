use wasm_bindgen::prelude::*;


#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

extern crate console_error_panic_hook;
use std::panic;

pub struct PrimeSieve {
    bits: Vec<bool>,
    size: u32,
}

impl PrimeSieve {
    pub fn new(size: u32) -> Self {
        let bits_size = (size / 2) as usize;
        let mut bits = Vec::with_capacity(bits_size);

        for _ in 0..bits_size {
            bits.push(true);
        }

        PrimeSieve { bits, size }
    }

    pub fn reset(self: &mut Self) {
        for i in 0..(self.size / 2) {
            self.bits[i as usize] = true;
        }
    }

    fn get(self: &Self, num: u32) -> bool {
        if num % 2 == 0 {
            return false;
        }
        self.bits[(num / 2) as usize]
    }

    fn clear(self: &mut Self, num: u32) {
        if num % 2 == 0 {
            panic!("Youre setting even bits");
        }

        self.bits[(num / 2) as usize] = false;
    }

    pub fn count_primes(self: &Self) -> u32 {
        let mut counter = 1;

        for i in (3..self.size).step_by(2) {
            if self.get(i) {
                counter += 1;
            }
        }

        counter
    }

    pub fn run_sieve(self: &mut Self) -> &Self {
        let mut factor = 3;
        let q = (self.size as f32).sqrt();

        // We need the explicit conversion here because q can be fractions larger than factor
        while (factor as f32) < q {
            for num in factor..self.size {
                if self.get(num) {
                    factor = num;
                    break;
                }
            }

            for num in ((factor * 3)..self.size).step_by((factor * 2) as usize) {
                self.clear(num);
            }

            factor += 2;
        }

        self
    }
}

#[wasm_bindgen]
pub fn prime_sieve(count: u32) -> u32 {
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    PrimeSieve::new(count).run_sieve().count_primes()
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[cfg(test)]
mod test {
    use crate::prime_sieve;

    #[test]
    fn test_sieve() {
        let known_values = [
            (10, 4),
            (100, 25),
            (1_000, 168),
            (10_000, 1229),
            (100_000, 9592),
            (1_000_000, 78498),
            (10_000_000, 664579),
            (100_000_000, 5761455),
        ];

        for (size, count) in known_values {
            assert_eq!(prime_sieve(size), count);
        }
    }
}
