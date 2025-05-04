export default function RightsideBar() {
  return (
    <div className="sticky top-0 pt-2 ml-4">
      <div className="space-y-4">
        {/* News */}
        <div className="w-full rounded-2xl border-1 border-stone-800 px-2 pb-3">
          <h1 className="text-xl font-bold px-2 pt-2">News on the go</h1>
          <div
            className="w-full rounded-2xl p-4 shadow-2xl mt-[1rem]"
            style={{ backgroundColor: "#0f0f0f" }}
          >
            <h2 className="font-bold">News headline</h2>
            <p className="pt-2">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatum optio aliquam at exercitationem error in dicta
              asperiores, quia tempore voluptatem tempora porro excepturi
              officiis vitae.
            </p>
          </div>
        </div>
        {/* Hot Picks */}
        <div className="w-full rounded-2xl border-1 border-stone-800 px-2 mt-3 pb-3">
          <h1 className="text-xl font-bold px-2 pt-2">Hot Picks</h1>
          <div
            className="w-full rounded-2xl p-4 shadow-2xl mt-[1rem]"
            style={{ backgroundColor: "#0f0f0f" }}
          >
            <h2 className="font-bold">News headline</h2>
            <p className="pt-2">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatum optio aliquam at exercitationem error in dicta
              asperiores, quia tempore voluptatem tempora porro excepturi
              officiis vitae.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
