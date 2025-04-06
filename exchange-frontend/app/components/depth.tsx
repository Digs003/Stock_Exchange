"use client";
import { useEffect, useState } from "react";
import { getDepth, getTicker, getTrade } from "@/app/utils/exchange_server";
import { AskTable } from "./AskTable";
import { BidTable } from "./BidTable";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { Depth, Ticker } from "@/app/utils/types";
function TableHeader() {
  return (
    <div className="flex justify-between text-xs">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Size</div>
      <div className="text-slate-500">Total</div>
    </div>
  );
}

export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>();
  const [asks, setAsks] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>();

  useEffect(() => {
    getDepth(market).then((data) => {
      setBids(data.bids.reverse());
      setAsks(data.asks);
    });
    getTicker(market).then((data) => {
      setPrice(data.lastPrice);
    });
    // Register the callback for depth updates
    SignalingManager.getInstance().registerCallback(
      "depth",
      (data: Partial<Depth>) => {
        setBids((prevbids) => {
          return updateOrderBook(prevbids ?? [], data?.bids ?? []);
        });
        setAsks((prevasks) => {
          return updateOrderBook(prevasks ?? [], data?.asks ?? []).reverse();
        });
      },
      `DEPTH-${market}`
    );
    // Subscribe to the depth updates
    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`depth.200ms.${market}`],
    });

    // Register the callback for ticker updates
    SignalingManager.getInstance().registerCallback(
      "ticker",
      (data: Partial<Ticker>) => {
        setPrice(data?.lastPrice);
      },
      `TICKER-${market}`
    );

    return () => {
      // Unsubscribe from the depth updates
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`depth.200ms.${market}`],
      });
      SignalingManager.getInstance().deregisterCallback(
        "depth",
        `DEPTH-${market}`
      );
      SignalingManager.getInstance().deregisterCallback(
        "ticker",
        `TICKER-${market}`
      );
    };

    //Trades
  }, [market]);

  return (
    <div>
      <TableHeader />
      {asks && <AskTable asks={asks} />}
      {price && <div>{price}</div>}
      {bids && <BidTable bids={bids} />}
    </div>
  );
}

function updateOrderBook(
  prevLevels: [string, string][],
  newLevels: [string, string][]
): [string, string][] {
  const levelMap = new Map(prevLevels);
  for (const [price, size] of newLevels) {
    if (parseFloat(size) === 0) {
      levelMap.delete(price);
    } else {
      levelMap.set(price, size);
    }
  }
  const updatedLevels = Array.from(levelMap.entries());
  return updatedLevels.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
}
