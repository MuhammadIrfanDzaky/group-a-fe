import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>This is homepage</h1>
      <h2>For the product page, go to <Link href="/product" className="text-blue-500 underline">here</Link></h2>
    </div>
  );
}
