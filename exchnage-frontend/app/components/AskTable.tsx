export const AskTable = ({ asks }: { asks: [string, string][] }) => {
  let curr_total = 0;
  const recent_asks = asks.slice(0, 15);

  const ask_rows: [string, string, number][] = [];
  for (const ask of recent_asks) {
    const [price, size] = ask;
    curr_total += Number(size);
    ask_rows.push([price, size, curr_total]);
  }
  ask_rows.reverse();
  const sumTotal = recent_asks.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (acc, [_, size]) => acc + Number(size),
    0
  );
  return (
    <div>
      {ask_rows.map(([price, size, total]) => (
        <Ask
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

function Ask({
  sumTotal,
  price,
  size,
  total,
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
          background: "rgba(228, 75, 68, 0.325)",
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
      <div className="flex justify-between text-xs w-full">
        <div>{price}</div>
        <div>{size}</div>
        <div>{total?.toFixed(2)}</div>
      </div>
    </div>
  );
}
