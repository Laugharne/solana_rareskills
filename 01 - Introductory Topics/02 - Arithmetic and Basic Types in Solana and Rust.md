[Arithmetic and Basic Types in Solana and Rust](https://www.rareskills.io/post/rust-arithmetic-operators)

# Arithmetic and Basic Types in Solana and Rust

![](assets/2024-02-13-16-38-00.png)

Today we will learn how to create a Solana program that accomplishes the same things as the Solidity contract below. We will also learn how Solana handles arithmetic issues like overflow.

```solidity
contract Day2 {

	event Result(uint256);
	event Who(string, address);
	
	function doSomeMath(uint256 a, uint256 b) public {
		uint256 result = a + b;
		emit Result(result);
	}

	function sayHelloToMe() public {
		emit Who("Hello World", msg.sender);
	}
}
```

Let’s start a new project
```bash
anchor init day_02
cd day_02
anchor build
anchor keys sync
```
--------
```bash
cargo update -p ahash@0.8.8 --precise 0.8.6
anchor build
cargo update -p solana-program@1.18.2 --precise 1.17.4
anchor build
```
--------

Be sure you have the Solana test validator running in one terminal:

```bash
solana-test-validator
```

And the Solana logs in another:

```bash
solana logs
```

Make sure the newly scaffolded program works properly by running the tests

```bash
anchor test --skip-local-validator
```

## Supplying Function Arguments

Before we do any math, let’s change the initialize function to receive two integers. Ethereum uses uint256 as the “standard” integer size. On Solana, it is u64 — this is equivalent to uint64 in Solidity.

  

### Passing unsigned integers

The default initialize function will look like the following:
```rust
pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    Ok(())
}
```

Modify `initialize()` function in `lib.rs` to be as follows.

```rust
pub fn initialize(ctx: Context<Initialize>,
                  a: u64,
                  b: u64) -> Result<()> {
    msg!("You sent {} and {}", a, b);
    Ok(())
}
```

Now we need to change the test in `./tests/day2.ts`

```typescript
it("Is initialized!", async () => { // Add your test here.
  const tx = await program.methods.initialize(new anchor.BN(777), new anchor.BN(888)).rpc();
  console.log("Your transaction signature", tx);
});
```

Now re-run `anchor test --skip-local-validator`.


When we look in the logs, we should see something like the following

![](assets/2024-02-13-16-42-06.png)


### Passing a string

Now let’s illustrate how to pass a string as an argument.

```rust
pub fn initialize(ctx: Context<Initialize>,
                  a: u64,
                  b: u64,
                  message: String) -> Result<()> {
    msg!("You said {:?}", message);
    msg!("You sent {} and {}", a, b);
    Ok(())
}
```

And change the test

```typescript
it("Is initialized!", async () => { // Add your test here.
  const tx = await program.methods
    .initialize( new anchor.BN(777), new anchor.BN(888), "hello").rpc();
    console.log("Your transaction signature", tx);
});
```

When we run the test, we see the new log

  

### Array of numbers

Next we add a function (and test) to illustrate passing an array of numbers. In Rust, a “vector”, or `Vec` is what Solidity calls an “array.”

```rust
pub fn initialize(ctx: Context<Initialize>,
                  a: u64,
                  b: u64,
                  message: String) -> Result<()> {
    msg!("You said {:?}", message);
    msg!("You sent {} and {}", a, b);
    Ok(())
}

// added this function
pub fn array(ctx: Context<Initialize>,
             arr: Vec<u64>) -> Result<()> {
    msg!("Your array {:?}", arr);
    Ok(())
}
```

And we update the unit test as follows

```typescript
it("Is initialized!", async () => { // Add your test here.
  const tx = await program.methods.initialize(new anchor.BN(777), new anchor.BN(888), "hello").rpc();
  console.log("Your transaction signature", tx);
});

// added this test
it("Array test", async () => {
  const tx = await program.methods.array([new anchor.BN(777), new anchor.BN(888)]).rpc();
  console.log("Your transaction signature", tx);
});
```

And we run the tests again and view the logs to see the array output:

![](assets/2024-02-13-16-47-24.png)

Tip: If you are stuck with an issue on your Anchor tests, try googling for “[Solana web3 js](https://solana-labs.github.io/solana-web3.js/)” as it relates to your error. The Typescript library used by Anchor is the Solana web3 js library.

  

## Math in Solana

### Floating point math

Solana has some, although limited, native support for floating point operations.

> However, it’s best to avoid floating point operations because of how computationally intensive they are (we will see an example of this later). Note that Solidity has no native support for floating point operations.

Read more about the limitations of using floats [here](https://docs.solana.com/developing/on-chain-programs/limitations#float-rust-types-support).

  

## Arithmetic Overflow

Arithmetic overflow was a common attack vector in Solidity until version 0.8.0 built overflow protection into the language by default. In Solidity 0.8.0 or higher, the overflow checks are done by default. Since these checks consume gas, sometimes devs strategically disable them with the “unchecked” block.

  

## How does Solana defend against arithmetic overflow?

### Method 1: overflow-checks = true in Cargo.toml

If the key `overflow-checks` is set to `true` in the **Cargo.toml** file, then Rust will add overflow checks at the compiler level. See the screenshot of Cargo.toml next:

![](assets/2024-02-13-16-48-58.png)

If the Cargo.toml file is configured in this manner, you don’t need to worry about overflow.

However, adding overflow checks increases the compute cost of the transaction (we will revisit this shortly). So under some circumstances where compute cost is an issue, you may wish to set `overflow-checks` to `false`. To strategically check for overflows, you can use the Rust `checked_\*` operators in Rust.

  

### Method 2: using checked_\* operators.

Let’s look at how overflow checks are applied to arithmetic operations within Rust itself. Consider the snippet of Rust below.

- On line 1, we do arithmetic using the usual `+` operator, which overflows silently.
- On line 2, we use `.checked_add`, which will throw an error if an overflow happens. Note that we have `.checked_\*` available for other operations, like `checked_sub` and `checked_mul`.

```rust
let x: u64 = y + z; // will silently overflow
let xSafe: u64 = y.checked_add(z).unwrap(); // will panic if overflow happens

// checked_sub, checked_mul, etc are also available
```

**Exercise 1:** Set `overflow-checks = true` create a test case where you underflow a `u64` by doing `0 - 1`. You will need to pass those numbers in as arguments or the code won’t compile. What happens?


You’ll see the transaction fails (with a rather cryptic error message shown below) when the test runs. That’s because Anchor turned on overf  low protection:

![](assets/2024-02-13-16-54-02.png)

**Exercise 2:** Now change `overflow-checks` to `false`, then run the test again. You should see an underflow value of **18446744073709551615**.

**Exercise 3:** With overflow protection disabled in Cargo.toml, do `let result = a.checked_sub(b).unwrap();` with `a = 0` and `b = 1`. What happens?

Should you just leave `overflow-checks = true` in the Cargo.toml file for your Anchor project? Generally, yes. But if you are doing some intensive calculations, you might want to set `overflow-checks` to `false` and strategically defend against overflows in key junctures to save compute cost, which we will demonstrate next.


## Solana compute units 101

In Ethereum, a transaction runs until it consumes the **“gas limit”** specified by the transaction. Solana calls “gas” a **“compute unit.”** By default, a transaction is limited to **200,000 compute units**. If more than 200,000 compute units are consumed, the transaction **reverts**.

  

### Determining compute costs of a transaction in Solana

Solana is indeed cheap to use compared to Ethereum, but that does not mean your optimizoooor skills in Ethereum development are useless. Let’s measure how much compute units our math functions require.

The Solana logs terminal also shows how many compute units were used. We’ve provided benchmarks for the checked and unchecked subtraction below.

With overflow **protection disabled** consumes **824** compute units:

![](assets/2024-02-13-16-57-18.png)

With overflow **protection enabled** in consumes **872** compute units:

![](assets/2024-02-13-16-58-01.png)

As you can see, just doing a simple math operation takes up almost 1000 units. Since we have 200k units, we can only do a **few hundred simple arithmetic operations** within the per-transaction **gas limit**. So, while transactions on Solana are generally cheaper than on Ethereum, we are still limited by a relatively small compute unit cap and would not be able to carry out computationally intensive tasks like fluid dynamic simulations on the Solana chain.

We’ll revisit transaction cost later.


## Powers does not use the same syntax as Solidity

In Solidity, if we want to raise x to the y power, we do
```solidity
uint256 result = x ** y;
```

Rust does not use this syntax. Instead, it uses .pow

```rust
let x: u64 = 2; // it is important that the base's data type is explicit
let y = 3; // the exponent data type can be inferred
let result = x.pow(y);
```

There is also `.checked_pow` if you are concerned about overflow.


## Floating points

One nice thing about using Rust for smart contracts is that we don’t have to import libraries like Solmate or Solady to do math. Rust is a pretty sophisticated language with a lot of operations built in, and if we need some piece of code, we can look outside the Solana ecosystem for a Rust crate (this is what libraries are called in Rust) to do the job.

  

Let’s take the **cube root of 50**. The cube root function for floats is built into the Rust language with the function `cbrt()`.

```rust
// note that we changed `a` to f32 (float 32)
// because `cbrt()` is not available for u64
pub fn initialize(ctx: Context<Initialize>, a: f32) -> Result<()> {
  msg!("You said {:?}", a.cbrt());
  Ok(());
}
```

Remember how we said in an earlier section that floats can be computationally expensive? Well, here we see our cube root operation consumed over 5 times as much as simple arithmetic on unsigned integers:

![](assets/2024-02-13-17-02-58.png)

**Exercise 4:** Build a calculator that does the **+**, **-**, **x**, and **÷**. and also **sqrt** and **log10**.