import * as anchor from "@project-serum/anchor";
import { IdlAccounts, Program } from "@project-serum/anchor";
import { Auction } from "../target/types/auction";
import {before} from "mocha";
import {AccountInfo, LAMPORTS_PER_SOL, PublicKey, SystemProgram} from "@solana/web3.js";

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
  const rent = 890880;

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
    let auctionState: IdlAccounts<Auction>["state"] = await program.account.state.fetch((state.publicKey));
    let bal = await provider.connection.getBalance(treasury.publicKey) - rent;
    
    console.log("State Initialized!");
    console.log("\tinitializer: ", auctionState.initializer.toString());
    console.log("\ttreasury: ", auctionState.treasury.toString());
    console.log("\tauction_end_time: ", auctionState.auctionEndTime.toString());
    console.log("\tended: ", auctionState.ended);
    console.log("\thighest_bid: ", auctionState.highestBid.toString());
    console.log("\thighest_bidder: ", auctionState.highestBidder.toString());

    console.log("\nTresury:");
    console.log("\tbalance - rent_exempt: ", bal.toString())
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
    let auctionState: IdlAccounts<Auction>["state"] = await program.account.state.fetch((state.publicKey));
    let bidAccount: IdlAccounts<Auction>["bidInfo"] = await program.account.bidInfo.fetch(pda1);
    let bal = await provider.connection.getBalance(treasury.publicKey) - rent;

    console.log("Bidder1: ", bidder1.publicKey.toString())
    console.log("\nBidInfo:")
    console.log("\tamount_locked:", bidAccount.amountLocked.toString());

    console.log("\nState:");
    console.log("\tinitializer: ", auctionState.initializer.toString());
    console.log("\ttreasury: ", auctionState.treasury.toString());
    console.log("\tauction_end_time: ", auctionState.auctionEndTime.toString());
    console.log("\tended: ", auctionState.ended);
    console.log("\thighest_bid: ", auctionState.highestBid.toString());
    console.log("\thighest_bidder: ", auctionState.highestBidder.toString());

    console.log("\nTresury:");
    console.log("\tbalance - rent_exempt: ", bal.toString())
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
    let auctionState: IdlAccounts<Auction>["state"] = await program.account.state.fetch((state.publicKey));
    let bidAccount: IdlAccounts<Auction>["bidInfo"] = await program.account.bidInfo.fetch(pda2);
    let bal = await provider.connection.getBalance(treasury.publicKey) - rent;

    console.log("Bidder2: ", bidder2.publicKey.toString())
    console.log("\nBidInfo:")
    console.log("\tamount_locked:", bidAccount.amountLocked.toString());

    console.log("\nState:");
    console.log("\tinitializer: ", auctionState.initializer.toString());
    console.log("\ttreasury: ", auctionState.treasury.toString());
    console.log("\tauction_end_time: ", auctionState.auctionEndTime.toString());
    console.log("\tended: ", auctionState.ended);
    console.log("\thighest_bid: ", auctionState.highestBid.toString());
    console.log("\thighest_bidder: ", auctionState.highestBidder.toString());

    console.log("\nTresury:");
    console.log("\tbalance - rent_exempt: ", bal.toString())
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
    let auctionState: IdlAccounts<Auction>["state"] = await program.account.state.fetch((state.publicKey));
    let bidAccount: IdlAccounts<Auction>["bidInfo"] = await program.account.bidInfo.fetch(pda3);
    let bal = await provider.connection.getBalance(treasury.publicKey) - rent;
    
    console.log("Bidder3: ", bidder3.publicKey.toString())
    console.log("\nBidInfo:")
    console.log("\tamount_locked:", bidAccount.amountLocked.toString());

    console.log("\nState:");
    console.log("\tinitializer: ", auctionState.initializer.toString());
    console.log("\ttreasury: ", auctionState.treasury.toString());
    console.log("\tauction_end_time: ", auctionState.auctionEndTime.toString());
    console.log("\tended: ", auctionState.ended);
    console.log("\thighest_bid: ", auctionState.highestBid.toString());
    console.log("\thighest_bidder: ", auctionState.highestBidder.toString());

    console.log("\nTresury:");
    console.log("\tbalance - rent_exempt: ", bal.toString())
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
    let auctionState: IdlAccounts<Auction>["state"] = await program.account.state.fetch((state.publicKey));
    let bidAccount: IdlAccounts<Auction>["bidInfo"] = await program.account.bidInfo.fetch(pda1);
    let bal = await provider.connection.getBalance(treasury.publicKey) - rent;

    console.log("Bidder1: ", bidder1.publicKey.toString())
    console.log("\nBidInfo:")
    console.log("\tamount_locked:", bidAccount.amountLocked.toString());

    console.log("\nState:");
    console.log("\tinitializer: ", auctionState.initializer.toString());
    console.log("\ttreasury: ", auctionState.treasury.toString());
    console.log("\tauction_end_time: ", auctionState.auctionEndTime.toString());
    console.log("\tended: ", auctionState.ended);
    console.log("\thighest_bid: ", auctionState.highestBid.toString());
    console.log("\thighest_bidder: ", auctionState.highestBidder.toString());

    console.log("\nTresury:");
    console.log("\tbalance - rent_exempt: ", bal.toString())
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
    let auctionState: IdlAccounts<Auction>["state"] = await program.account.state.fetch((state.publicKey));
    let bal = await provider.connection.getBalance(treasury.publicKey) - rent;
    
    console.log("State Initialized!");
    console.log("\tinitializer: ", auctionState.initializer.toString());
    console.log("\ttreasury: ", auctionState.treasury.toString());
    console.log("\tauction_end_time: ", auctionState.auctionEndTime.toString());
    console.log("\tended: ", auctionState.ended);
    console.log("\thighest_bid: ", auctionState.highestBid.toString());
    console.log("\thighest_bidder: ", auctionState.highestBidder.toString());

    console.log("\nTresury:");
    console.log("\tbalance - rent_exempt: ", bal.toString())
  });

  it("Refund losers!", async () => {

    const tx1 = await program.rpc.refund(
      {
        accounts: {
          state: state.publicKey,
          bidAccount: pda2,
          bidder: bidder2.publicKey,
          treasury: treasury.publicKey,
        },
        signers: [bidder2],
    });
    let bal1 = await provider.connection.getBalance(treasury.publicKey) - rent;
    console.log("Tresury:");
    console.log("\tbalance - rent_exempt: ", bal1.toString());

    const tx2 = await program.rpc.refund(
        {
          accounts: {
            state: state.publicKey,
            bidAccount: pda3,
            bidder: bidder3.publicKey,
            treasury: treasury.publicKey,
          },
          signers: [bidder3],
      });
      let bal2 = await provider.connection.getBalance(treasury.publicKey) - rent;
      console.log("Tresury:");
      console.log("\tbalance - rent_exempt: ", bal2.toString());
  });
});
