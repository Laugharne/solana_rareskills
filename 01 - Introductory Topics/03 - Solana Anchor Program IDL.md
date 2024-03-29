[Solana Anchor Program IDL](https://www.rareskills.io/post/anchor-idl)

# Solana Anchor Program IDL

![](assets/2024-02-14-14-31-28.png)  

The **IDL (Interface Definition Language)** is a **JSON** file that describes how to interact with a Solana program. It is automatically generated by the Anchor framework.

There is nothing special about the function called “initialize” — it’s a name Anchor picks. What we will learn in this tutorial is how the typescript unit tests are able to “find” the appropriate function.

  
```bash
anchor init anchor-function-tutorial
cd anchor-function-tutorial
anchor build
cargo update -p solana-program@1.18.2 --precise 1.17.4
anchor build
cargo update -p ahash@0.8.8 --precise 0.8.6
anchor build
```

Let’s create a new project called `anchor-function-tutorial` and change the name in the initialize function to `boaty_mc_boatface`, keeping everything else the same.

```rust
pub fn boaty_mc_boatface(ctx: Context<Initialize>) -> Result<()> {
    Ok(())
}
```

Now let’s change the test to the following

```typescript  
it("Call boaty mcboatface", async () => { // Add your test here. 
  const tx = await program.methods.boatyMcBoatface().rpc();
  console.log("Your transaction signature", tx);
});
```

Now run the tests with `anchor test --skip-local-validator`

It runs as expected. So how did this sorcery work?


### How do the tests know about the initialize function?

When Anchor builds a Solana program, it creates an **IDL (Interface Definition Language)**.

This is stored in `target/idl/anchor_function_tutorial.json`. This file is called `anchor_function_tutorial.json` because **anchor_function_tutorial** is the name of the program. Note that anchor converted the **dashes** to **underscores**!

Let’s open it.

```json
{
  "version": "0.1.0",
  "name": "anchor_function_tutorial",
  "instructions": [
    {
      "name": "boatyMcBoatface",
      "accounts": [],
      "args": []
    }
  ]
}
```

The list of *“instructions”* is the public facing functions that the program supports, roughly equivalent to the external and public functions on an Ethereum contract. An **IDL file in Solana** plays a similar role as the **ABI file in Solidity**, specifying how to interact with the program’s/contract’s.

> We saw earlier that our function didn’t take any arguments, so that’s why the **args** list is empty. We’ll explain later what *“accounts”* is.

One thing that stands out: functions **in Rust** are **snake_cased**, but **Anchor formats** them in **JavaScript** land as **camelCased**. This is to respect the conventions of the languages: Rust tends to use snake case, and JavaScript typically uses camel case.

This JSON file is how the *“methods”* object knows what functions to support.

When we run the test, we expect it to pass, which means the test is correctly calling the Solana program:

![](assets/2024-02-14-14-58-33.png)

**Exercise**: Add an argument to the `boaty_mc_boatface` function to receive a `u64`. Run `anchor build` again. Then open up the `target/idl/anchor_function_tutorial.json` file again. How does it change?

Now let’s start to create a Solana program that has functions for **basic addition and subtraction** which print the result. Solana functions cannot return values the way Solidity does, so we will have to print them. (*Solana has alternative ways of passing values we will discuss later*).

Let’s create two functions like so:

```rust
pub fn add(ctx: Context<Initialize>, a: u64, b: u64) -> Result<()> {
  let sum = a + b;
  msg!("Sum is {}", sum);  
	Ok(())
}

pub fn sub(ctx: Context<Initialize>, a: u64, b: u64) -> Result<()> {
  let difference = a - b;
  msg!("Difference is {}", difference);  
	Ok(())
}
```

And change our unit tests to the following:

```typescript
it("Should add", async () => {
  const tx = await program.methods.add(new anchor.BN(1), new anchor.BN(2)).rpc();
  console.log("Your transaction signature", tx);
});

it("Should sub", async () => {
  const tx = await program.methods.sub( new anchor.BN(10), new anchor.BN(3)).rpc();
  console.log("Your transaction signature", tx);
});
```

Exercise: Implement similar functions for **mul**, **div**, and **mod**, and write a unit test to trigger each one.

  

### What about the Initialize struct?

Now there is another sneaky thing going on here. We’ve left the `Initialize` struct untouched and are reusing it between functions. Again, the name does not matter. Let’s change the struct name to `Empty` and re-run the test.

```rust
//...
  // Change struct name here
	pub fn add(ctx: Context<Empty>, a: u64, b: u64) -> Result<()> {
	    let sum = a + b;
	    msg!("Sum is {}", sum);
	    Ok(())
	}
//...

// Change struct name here too
#[derive(Accounts)]
pub struct Empty {}
```

Again, the name **Empty** is totally arbitrary here.

**Exercise**: Change the struct name **Empty** to **BoatyMcBoatface** and re-run the tests.


### What is #[derive(Accounts)] struct?

This `#` syntax is a [Rust attribute](https://doc.rust-lang.org/reference/attributes.html) defined by the Anchor framework. We will explain this further in a later tutorial. For now, we want to pay attention to the accounts key in the IDL and how it relates to the struct defined in the program.

  

### Accounts IDL key

Below we screenshot the IDL of our program above. So we can see the relationship between the “Accounts” in that Rust Attribute **#[derive(Accounts)]** and the **“accounts” key** in the IDL:

![](assets/2024-02-14-15-08-39.png)

In our example, the **accounts** key in the JSON IDL above marked by the purple arrow is empty. But that is not the case for most useful Solana transactions as we will learn later.

Because our `account` struct for **BoatyMcBoatface** is empty, the accounts list in the IDL is empty also.

Now let’s see what happens when the struct is non-empty. Copy the code below and replace the contents of [lib.rs](http://lib.rs).

```rust
use anchor_lang::prelude::*;

declare_id!("8PSAL9t1RMb7BcewhsSFrRQDq61Y7YXC5kHUxMk5b39Z");

#[program]
pub mod anchor_function_tutorial {
    use super::*;

    pub fn non_empty_account_example(ctx: Context<NonEmptyAccountExample>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct NonEmptyAccountExample<'info> {
    signer: Signer<'info>,
    another_signer: Signer<'info>,
}
```

Now run `anchor build` - let’s see what we get back in the new IDL.

```json
{
  "version": "0.1.0",
  "name": "anchor_function_tutorial",
  "instructions": [
    {
      "name": "nonEmptyAccountExample",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "anotherSigner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "metadata": {
    "address": "8PSAL9t1RMb7BcewhsSFrRQDq61Y7YXC5kHUxMk5b39Z"
  }
}
```

Note that **“accounts”** is no longer empty and is populated with the fields from the struct: **“signer”** and **“anotherSigner”** (note that **another_signer** got transformed from **snake case** into **camel case**). The IDL has been updated to match the struct we just changed, specifically with the number of accounts we added.

We’ll dive further into the **“Signer”** in an upcoming tutorial, but for now you can think of it as analogous to `tx.origin` in **Ethereum**.


### A second example of a program and an IDL.

**To summarize** everything we’ve learned so far, let’s build another program with different functions and Account structs.

```rust
use anchor_lang::prelude::*;

declare_id!("8PSAL9t1RMb7BcewhsSFrRQDq61Y7YXC5kHUxMk5b39Z");

#[program]
pub mod anchor_function_tutorial {
    use super::*;

    pub fn function_a(ctx: Context<NonEmptyAccountExample>) -> Result<()> {
        Ok(())
    }

    pub fn function_b(ctx: Context<Empty>, firstArg: u64) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct NonEmptyAccountExample<'info> {
    signer: Signer<'info>,
    another_signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Empty {}
```

Now build it with `anchor build`

Let’s look again at the IDL file `target/idl/anchor_function_tutorial.json` and place these files side by side:

![](assets/2024-02-14-15-15-33.png)

Can you see the relationship between the IDL file and the program above?

The function `function_a` has no arguments and this shows in the IDL as an empty array under the `args` key.

It's `Context` takes the `NonEmptyAccountExample` struct. This struct `NonEmptyAccountExample` has two signer fields: `signer` and `another_signer`. Note that these are repeated as elements in the account key in the IDL for `function_a`. You can see that Anchor translated Rust's snake case to camel case in the IDL.

The function `function_b` takes an `u64` argument. Its context struct is empty, so the **accounts** key in IDL for `function_b` is an empty array.

In general, we expect the array of items in the IDL's **accounts** key to match the keys of the account struct that the function takes in its `ctx` argument.


### Summary

In this chapter:

- We learned Solana uses an **IDL (iInterface Definition Language)** to show how to interact with a Solana program and what fields appear in the IDL.
- We introduced the struct modified by **#[derive(Accounts)]** and how it relates to function arguments.
- Anchor interprets **snake_case** functions in Rust as **camelCase** functions in the Typescript tests.