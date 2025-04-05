export const BidTable = ({ bids }: { bids: [string, string][] }) => {
  let curr_total = 0;
  const recent_bids = bids.slice(0, 15);

  const bid_rows: [string, string, number][] = [];
  for (const bid of recent_bids) {
    const [price, size] = bid;
    curr_total += Number(size);
    bid_rows.push([price, size, curr_total]);
  }
  const sumTotal = recent_bids.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (acc, [_, size]) => acc + Number(size),
    0
  );
  return (
    <div>
      {bid_rows.map(([price, size, total]) => (
        <Bid
          sumTotal={sumTotal}
          key={price}
          price={price}
          size={size}
          total={total}
        />
      ))}
    </div>
  );
};

function Bid({
  price,
  size,
  total,
  sumTotal,
}: {
  sumTotal: number;
  price: string;
  size: string;
  total: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        backgroundColor: "transparent",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${(100 * total) / sumTotal}%`,
          height: "100%",
          background: "rgba(1, 167, 129, 0.325)",
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
      <div className={`flex justify-between text-xs w-full`}>
        <div>{price}</div>
        <div>{size}</div>
        <div>{total.toFixed(2)}</div>
      </div>
    </div>
  );
}
