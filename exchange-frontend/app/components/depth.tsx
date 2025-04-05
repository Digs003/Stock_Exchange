"use client";
import { useEffect, useState } from "react";
import { getDepth, getTicker, getTrade } from "@/app/utils/exchange_server";
import { AskTable } from "./AskTable";
import { BidTable } from "./BidTable";

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

    //Trades
  }, []);

  return (
    <div>
      <TableHeader />
      {asks && <AskTable asks={asks} />}
      {price && <div>{price}</div>}
      {bids && <BidTable bids={bids} />}
    </div>
  );
}
