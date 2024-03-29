[Require, Revert, and Custom Errors in Solana](https://www.rareskills.io/post/solana-require-macro)

# Require, Revert, and Custom Errors in Solana

![](assets/2024-02-14-16-41-04.png)

In Ethereum, we often see a require statement restricting the values a function argument can have. Consider the following example:

```solidity
function foobar(uint256 x) public {
    require(x < 100, "I'm not happy with the number you picked");
    // rest of the function logic
}
```

In the code above, the transaction will revert if `foobar` is passed a value of **100 or greater**.

How do we do this in Solana, or specifically, in the Anchor framework?

Anchor has equivalents for **Solidity**’s custom **error** and **require** statements. Their [documentation](https://www.anchor-lang.com/docs/errors) on the subject is quite good, but we will also explain how to halt transactions when the function arguments are not what we want them to be.

```bash
anchor init day_04
cd day_04
anchor build
cargo update -p solana-program@1.18.2 --precise 1.17.4
anchor build
cargo update -p ahash@0.8.8 --precise 0.8.6
anchor build
```

The Solana program below has a function `limit_range` which will only accept values 10 to 100 inclusive:

```rust
use anchor_lang::prelude::*;

declare_id!("8o3ehd3XnyDocd9hG1uz5trbmSRB7gaLaE9BCXDpEnMY");

#[program]
pub mod day4 {
    use super::*;

    pub fn limit_range(ctx: Context<LimitRange>, a: u64) -> Result<()> {
        if a < 10 {
            return err!(MyError::AisTooSmall);
        }
        if a > 100 {
            return err!(MyError::AisTooBig);
        }
        msg!("Result = {}", a);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct LimitRange {}

#[error_code]
pub enum MyError {
    #[msg("a is too big")]
    AisTooBig,
    #[msg("a is too small")]
    AisTooSmall,
}
```

The following code unit tests the program above:

```javascript
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorError } from "@coral-xyz/anchor";
import { Day4 } from "../target/types/day4";
import { assert } from "chai";

describe("day4", () => { // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day4 as Program<Day4>;

  it("Input test", async () => { // Add your test here.
    try {
      const tx = await program.methods.limitRange(new anchor.BN(9)).rpc();
      console.log("Your transaction signature", tx);
    } catch (_err) { assert.isTrue(_err instanceof AnchorError);
      const err: AnchorError = _err;
      const errMsg = "a is too small"; assert.strictEqual(err.error.errorMessage, errMsg);
      console.log("Error number:", err.error.errorCode.number);
    } try {
      const tx = await program.methods.limitRange(new anchor.BN(101)).rpc();
      console.log("Your transaction signature", tx);
    } catch (_err) { assert.isTrue(_err instanceof AnchorError);
      const err: AnchorError = _err;
      const errMsg = "a is too big"; assert.strictEqual(err.error.errorMessage, errMsg);
      console.log("Error number:", err.error.errorCode.number);
    }
  });
}); 
```

```
  day_04
Error number: 6001
Error number: 6000
    ✔ Input test (48ms)


  1 passing (50ms)
```



**Exercise**:

1. What pattern do you notice with the Error number? What happens to the error codes if you change the order of the errors in the Enum MyError?
2. Use this code block which adds the new func and error to the existing code:

```rust
#[program]
pub mod day_4 {
    use super::*;

    pub fn limit_range(ctxThen : Context<LimitRange>, a: u64) -> Result<()> {
        require!(a >= 10, MyError::AisTooSmall);
        require!(a <= 100, MyError::AisTooBig);
        msg!("Result = {}", a);
        Ok(())
    }

    // NEW FUNCTION
    pub fn func(ctx: Context<LimitRange>) -> Result<()> {
        msg!("Will this print?");
        return err!(MyError::AlwaysErrors);
    }
}

#[derive(Accounts)]
pub struct LimitRange {}

#[error_code]
pub enum MyError {
    #[msg("a is too small")]
    AisTooSmall,
    #[msg("a is too big")]
    AisTooBig,
    #[msg("Always errors")]  // NEW ERROR, what do you think the error code will be?
    AlwaysErrors,
}
```

And add this test:

```javascript
it("Error test", async () => { // Add your test here. try {
      const tx = await program.methods.func().rpc();
      console.log("Your transaction signature", tx);
    } catch (_err) { assert.isTrue(_err instanceof AnchorError);
      const err: AnchorError = _err;
      const errMsg = "Always errors"; assert.strictEqual(err.error.errorMessage, errMsg);
      console.log("Error number:", err.error.errorCode.number);
    }); 
```

Before you run this, what do you think the new error code will be?

```
  day_04
Error number: 6000
Error number: 6001
    ✔ Input test (57ms)
Error number: 6002
    ✔ Error test


  2 passing (68ms)
```
The significant difference between how Ethereum and Solana stops transactions with invalid parameters is that Ethereum triggers a revert and Solana returns an error.


## Using require statements

There is a `require!` macro, which is conceptually the same as `require` from Solidity, which we can use to consolidate our code. Switching from `if` checks (which take three lines) to `require!` calls, our earlier code translates to the following:

```rust
pub fn limit_range(ctx: Context<LimitRange>, a: u64) -> Result<()> {
    require!(a >= 10, Day4Error::AisTooSmall);
    require!(a <= 100, Day4Error::AisTooBig);

    msg!("Result = {}", a);
    Ok(())
}
```
**In Ethereum**, we know nothing gets logged if a function reverts, even if the revert happens after the log. For example, a call to `tryToLog` in the contract below would not log anything, because the function reverts:

```solidity
contract DoesNotLog {
	event SomeEvent(uint256);

	function tryToLog() public {
		emit SomeEvent(100);
		require(false);
	}
}
```

**Exercise**: What happens if you put a `msg!` macro before the return error statements in a Solana program function? What happens if you replace **return err!** with **Ok(())**? Below we have a function that logs something with `msg!` then returns an error. See if the contents of the `msg!` macro get logged.

```rust
pub fn func(ctx: Context<ReturnError>) -> Result<()> {
		msg!("Will this print?");
		return err!(Day4Error::AlwaysErrors);
}

#[derive(Accounts)]
pub struct ReturnError {}

#[error_code]
pub enum Day4Error {
    #[msg("AlwaysErrors")]
    AlwaysErrors,
}
```

> Under the hood, the `require!` macro is no different from returning an error, it’s just **syntaxic sugar**.

The expected result is that *“Will this print?”* will print when you return `Ok(())` and not print when you return an error.


## Differences between Solana and Solidity with regards to errors

### In Solidity
The `require` statement **halts** the execution with the `revert` op code.

**Solana** does **not halt** execution but simply **returns a different value**. This is analogous to how linux returns 0 or 1 on success. If a 0 is returned (equivalent of returning `Ok(())`), everything went smoothly.

> Therefore, Solana programs **should always** return something — either an `Ok(())` or an `Error`.

### In Anchor
Errors are an enum with the **#[error_code]** attribute.

> Note how all the functions in Solana have a return type of `Result<()>`. A [result](https://doc.rust-lang.org/std/result/) is a type that could either be an `Ok(())` or an `Error`.


## Question and Answers

### Why does Ok(()) not have a semicolon at the end?

If you add it, your code won’t compile. If the final statement in Rust does not have a semicolon, then the value on that line is returned.


### Why does Ok(()) have an extra set of parenthesis?

The `()` means “unit” in Rust, which you can think of as being a **void in C** or a **Nothing in Haskell**.

Here, `Ok` is an enum which contains a unit type. That is what get returns. Functions that don’t return things implicitly return the unit type in Rust.

An `Ok(())` with **no semicolon** is syntactically equivalent to **return `Ok(());`**. Note the semicolon at the end.


### How come the if statements above are missing parenthesis?

Those are optional in Rust.