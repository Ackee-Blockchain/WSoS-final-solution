import * as anchor from "@project-serum/anchor";
import { IdlAccounts, Program } from "@project-serum/anchor";
import { Auction } from "../target/types/auction";
import {before} from "mocha";
import {LAMPORTS_PER_SOL, PublicKey, SystemProgram} from "@solana/web3.js";

describe("auction", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const provider = anchor.getProvider();
  const program = anchor.workspace.Auction as Program<Auction>;

  const state = anchor.web3.Keypair.generate();
  const treasury = anchor.web3.Keypair.generate();
  const initializer = anchor.web3.Keypair.generate();
  const bidder1 = anchor.web3.Keypair.generate();
  const bidder2 = anchor.web3.Keypair.generate();
  const bidder3 = anchor.web3.Keypair.generate();

    const [pda1, nonce1] = await PublicKey.findProgramAddress(
      [state.publicKey.toBytes(), bidder1.publicKey.toBytes()],
      program.programId
    );

    const [pda2, nonce2] = await PublicKey.findProgramAddress(
      [state.publicKey.toBytes(), bidder2.publicKey.toBytes()],
      program.programId
    );

    const [pda3, nonce3] = await PublicKey.findProgramAddress(
      [state.publicKey.toBytes(), bidder3.publicKey.toBytes()],
      program.programId
    );

  it("Is initialized!", async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(initializer.publicKey, 10000000000),
      "confirmed"
    );

    const tx = await program.rpc.initialize(
      new anchor.BN(5),
      {
        accounts: {
          state: state.publicKey,
          treasury: treasury.publicKey,
          initializer: initializer.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [state, treasury, initializer],
    });
    console.log("Your transaction signature", tx);
  });

  it("Bidder1 Bid!", async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(bidder1.publicKey, 10000000000),
      "confirmed"
    );

    const tx = await program.rpc.bid(
      new anchor.BN(50),
      {
        accounts: {
          bid: pda1,
          bidder: bidder1.publicKey,
          state: state.publicKey,
          treasury: treasury.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [bidder1],
    });
    console.log("Your transaction signature", tx);
    let auctionState:IdlAccounts<Auction>["state"] = await program.account.state.fetch((state.publicKey));
    console.log("Bidder PubKey", auctionState.treasury.toString());
  });

  it("Bidder2 Bid!", async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(bidder2.publicKey, 10000000000),
      "confirmed"
    );

    const tx = await program.rpc.bid(
      new anchor.BN(40),
      {
        accounts: {
          bid: pda2,
          bidder: bidder2.publicKey,
          state: state.publicKey,
          treasury: treasury.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [bidder2],
    });
    console.log("Your transaction signature", tx);
    let auctionState:IdlAccounts<Auction>["state"] = await program.account.state.fetch((state.publicKey));
    console.log("Bidder PubKey", auctionState.treasury.toString());
  });

  it("Bidder3 Bid!", async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(bidder3.publicKey, 10000000000),
      "confirmed"
    );

    const tx = await program.rpc.bid(
      new anchor.BN(40),
      {
        accounts: {
          bid: pda3,
          bidder: bidder3.publicKey,
          state: state.publicKey,
          treasury: treasury.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [bidder3],
    });
    console.log("Your transaction signature", tx);
    let auctionState:IdlAccounts<Auction>["state"] = await program.account.state.fetch((state.publicKey));
    console.log("Bidder PubKey", auctionState.treasury.toString());
  });

  it("Bidder1 Bid Higher!", async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(bidder1.publicKey, 10000000000),
      "confirmed"
    );

    const tx = await program.rpc.bid(
      new anchor.BN(70),
      {
        accounts: {
          bid: pda1,
          bidder: bidder1.publicKey,
          state: state.publicKey,
          treasury: treasury.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [bidder1],
    });
    console.log("Your transaction signature", tx);
    let auctionState:IdlAccounts<Auction>["state"] = await program.account.state.fetch((state.publicKey));
    console.log("Bidder PubKey", auctionState.treasury.toString());
  });

  it("End auction!", async () => {

    await new Promise(f => setTimeout(f, 5000));

    const tx = await program.rpc.endAuction(
      {
        accounts: {
          state: state.publicKey,
          initializer: initializer.publicKey,
          treasury: treasury.publicKey,
          highestBidder: bidder1.publicKey,
          winnersBid: pda1
        },
        signers: [initializer],
    });
    console.log("Your transaction signature", tx);
  });

  it("Refund losers!", async () => {

    const tx = await program.rpc.refund(
      {
        accounts: {
          state: state.publicKey,
          bidAccount: pda2,
          bidder: bidder2.publicKey,
          treasury: treasury.publicKey,
        },
        signers: [bidder2],
    });
    console.log("Your transaction signature", tx);
  });
});
