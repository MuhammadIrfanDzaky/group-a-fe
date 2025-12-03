"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BiChevronLeft } from "react-icons/bi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdOutlineThumbUp } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { ReviewModal } from "../component/ReviewModals";
import LoadingSpinner from "../component/LoadingSpinner";
import { productResponseSchema, type ProductResponse } from "../lib/validation";

const ProductContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productData, setProductData] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  // Get product ID from URL params or use a default/placeholder
  const productId = searchParams.get('id') || '2'; // Replace with your product ID you want to fetch

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      
      // Validate response data
      const validationResult = productResponseSchema.safeParse(data);
      if (!validationResult.success) {
        console.error('Invalid product data structure:', validationResult.error);
        throw new Error('Invalid product data received');
      }
      
      setProductData(validationResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-white text-black relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  const reviewCount = productData?.total ?? 0;
  const productTitle = productData?.title ?? "";
  const productImage = productData?.image ?? ""; 

  return (
    <div
      className="bg-white text-black relative"
    >

      {/* # navbar section */}
      <div
        className="w-full bg-white py-3.5 px-7 text-black"
      >
        <BiChevronLeft className="text-[24px]" />
      </div>

      {/* image section */}
      <div
        className="relative w-full h-[647px]"
      >
        <Image 
          src={productImage}
          fill
          alt="product-image"
          className="object-cover"
        />
      </div>

      {/* product description section */}
      <div
        className="flex flex-col bg-white items-start text-black py-[18px] px-[30px] text-[18px] font-semibold leading-[15px]"
      >

        {/* product title */}
        <div className="w-2/3">
          <span>{productTitle}</span>
        </div>

        {/* product rating */}
        <div
          className="flex flex-row items-center justify-start gap-[11px] bg-white text-black"
        >

          {/* stars */}
          {reviewCount > 0 && (
            <div
              className="flex flex-row gap-2 text-[#FBBF24] py-[18px]"
            >
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaRegStar className="text-gray-400 font-bold"/>
            </div>
          )}

          {/* review count */}
          {reviewCount > 0 && (
            <div>
              <span 
                className="text-[9px] text-base font-normal"
              >
                {`${reviewCount} Review${reviewCount !== 1 ? 's' : ''}`}
              </span>
            </div>
          )}

        </div>

      </div>

      <div
        className="px-[30px]"
      >
        <div
          className="w-full h-0.5 bg-[#9B9A9A]"
        >

        </div>
      </div>

      {/* overall review section */}
      <div
        className="flex flex-col px-[30px] py-[13px] gap-[18px]"
      >

        {/* header */}
        <div
          className="flex flex-row items-center justify-between"
        >
          {reviewCount === 0 ? (
            <span className="text-[14px] font-bold cursor-pointer" onClick={() => setIsModalOpen(true)}>
              Be the first to review
            </span>
          ) : (
            <>
              <span className="text-[14px] font-bold cursor-pointer" onClick={() => setIsModalOpen(true)}>REVIEWS ({reviewCount})</span>
              <Link href="#" className="underline text-green-800 text-[14px] font-bold">View More &gt;</Link>
            </>
          )}
        </div>

        {reviewCount > 0 && (
          <>
            {/* stars */}
            <div>
              <div className="flex flex- text-[12px] gap-2 text-[#FBBF24]">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaRegStar className="text-gray-400 font-bold"/>
              </div>
            </div>


            {/* rating bar */}
            <div
              className=""
            >
              <div
                className="flex flex-col gap-3.5 text-[12px] w-full"
              >

                {/* small */}
                <div
                  className="flex flex-row items-center justify-between gap-4"
                >
                  <div
                    className="w-3/12"
                  >
                    <span>Small</span>
                  </div>
                  <div
                    className="flex w-8/12 bg-[#D9D9D9] h-[9px]"
                  >
                    <div
                      className="flex w-2/100 bg-[#2B6646]"
                    >

                    </div>
                  </div>
                  <div
                    className="flex items-center justify-end w-1/12"
                  >
                    <span>2%</span>
                  </div>
                </div>

                {/* true to size */}
                <div
                  className="flex flex-row items-center justify-between gap-4"
                >
                  <div
                    className="w-3/12"
                  >
                    <span>True to Size</span>
                  </div>
                  <div
                    className="flex w-8/12 bg-[#D9D9D9] h-[9px]"
                  >
                    <div
                      className="flex w-85/100 bg-[#2B6646]"
                    >

                    </div>
                  </div>
                  <div
                    className="flex items-center justify-end w-1/12"
                  >
                    <span>85%</span>
                  </div>
                </div>
                
                {/* large */}
                <div
                  className="flex flex-row items-center justify-between gap-4"
                >
                  <div
                    className="w-3/12"
                  >
                    <span>Large</span>
                  </div>
                  <div
                    className="flex w-8/12 bg-[#D9D9D9] h-[9px]"
                  >
                    <div
                      className="flex w-13/100 bg-[#2B6646]"
                    >
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-end w-1/12"
                  >
                    <span>13%</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* divider */}
      {reviewCount > 0 && (
        <div
          className="px-[30px]"
        >
          <div
            className="w-full h-0.5 bg-[#9B9A9A]"
          >

          </div>
        </div>
      )}

      {/* user review section */}
      {reviewCount > 0 && (
        <div
          className="px-[30px] py-[13px]"
        >

        {/* header */}
        <div
          className="flex flex-row items-center justify-between gap-4"
        >

          {/* photo porfil, star, detail */}
          <div
            className="flex flex-row items-center justify-center gap-[15px]"
          >

            {/* photo profil */}
            <div
              className="flex bg-gray-400 h-[29px] w-[29px] rounded-full"
            >
              
            </div>

            {/* star and detail */}
            <div
              className="flex flex-col gap-3.5"
            >

              {/* star */}
              <div
                className="flex flex-row gap-[5px] text-[11px] text-[#FBBF24]"
              >
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              {/* detail */}
              <div className="text-[9px] text-[#9B9A9A] font-medium">
                <span>165 CM   65 KG   88 / 78 / 110 CM</span>
              </div>

            </div>
          </div>


          {/* like button */}
          <div
            className="flex flex-row items-center justify-center gap-1.5"
          >
            <MdOutlineThumbUp className="text-[20px]"/>
            <span className="text-[12px]">(5)</span>
          </div>

        </div>

        {/* user review text */}
        <div
          className="flex flex-col gap-[11px] mt-5 text-[12px]"
        >
          <p>
            This black kaftan is a wardrobe staple for me now! The quality is outstanding, and it&apos;s incredibly versatile. I&apos;ve worn it to brunch with friends, to the beach as a cover-up, and even to a formal dinner with the right accessories. It&apos;s so comfortable and easy to style. I can&apos;t recommend it enough! ps. btw im using my boyfriend account xixi!
          </p>
        </div>

        {/* user review date */}
        <div
          className="mt-[11px] text-[9px] text-[#9B9A9A]"
        >
          <span>Nov 29, 2023</span>
        </div>
      </div>
      )}

      {/* product price */}
      <div
        className="flex flex-row items-start justify-between bg-white px-3.5 py-[11px] text- h-[108px] sticky bottom-0 border border-[#2B6646]/20"
      >
        <div
          className="flex flex-col"
        >
          <span>Rent Fee</span>
          <span className="font-semibold">Rp 300.000/4 Day</span>
        </div>
        <div>
          <button
            className="px-[53px] py-4 bg-[#CDAA44] rounded-sm"
          >
            ADD
          </button>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        onSuccess={fetchProduct}
      />

    </div>
  )
}

const ProductPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductContent />
    </Suspense>
  );
}

export default ProductPage