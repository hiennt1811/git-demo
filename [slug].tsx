import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import {ParsedUrlQuery} from "querystring";
import TourDetailHead from "../../components/tourDetail/TourDetailHead";
import TourDetailHeader from "../../components/tourDetail/TourDetailHeader";
import MobileSlider from "../../components/tourDetail/MobileSlider";
import Breadcrumb from "../../components/tourDetail/Breadcrumb";
import ImageSlider from "../../components/tourDetail/ImageSlider";
import {Tour, TourCategory, TourImage} from "../../models/Tour";
import TourInformation from "../../components/tourDetail/TourInformation";
import {useRouter} from "next/router";
import Introduction from "../../components/tourDetail/Introduction";
import Advisory from "../../components/tourDetail/Advisory";
import BookingPanel from "../../components/tourDetail/BookingPanel";
import useDocumentScrollY from "../../hooks/useDocumentScrollY";
import classNames from "classnames";
import getPostDetail from "../../lib/getPostDetail";
import getTourAlbum from "../../lib/getTourAlbum";
import getAncestorsCategories from "../../lib/getAncestorsCategories";
import findMax from "../../utils/findMax";

interface TourDetailProps {
  id: number,
  tour: Tour,
  images: TourImage[],
  categories: TourCategory[],
}

interface TourDetailParams extends ParsedUrlQuery {
  slug: string,
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<TourDetailProps, TourDetailParams> = async ({params}) => {
  if (!params) {
    return {
      notFound: true
    }
  }
  const {slug} = params;
  const idInString = slug.substring(0, slug.indexOf('-'));
  const id = parseInt(idInString);
  const tour = await getPostDetail(id);
  const images = await getTourAlbum(id);
  const categories = await getAncestorsCategories(findMax(tour?.categories!, (item, max) => (item.id! > max.id!)))
  console.log('post', tour?.categories);
  if (!tour) {
    return {notFound: true}
  }
  return {
    props: {
      id,
      tour,
      images,
      categories,
    },
    revalidate: 60,
  }
}

const TourDetail: NextPage<TourDetailProps> = (props) => {
  // TODO: Get detail of tour
  // TODO: Get reviews
  // TODO: Get album
  // TODO: Get related tours
  // TODO: SEO
  const {id, tour, images, categories} = props;
  const router = useRouter();
  const scrollY = useDocumentScrollY();
  return (
    <>
      <TourDetailHead title={'Test'}/>
      <TourDetailHeader/>
      <div id="body-detail-tour">
        <MobileSlider images={[]}/>
        <div className="container padding-0-tablet">
          <Breadcrumb tour={tour} categories={categories} />
          <div className="row dp-n">
            <div className="col-md-12">
              <div className="title-detail-tour">
                <h1>{tour.title}</h1>
              </div>
            </div>
          </div>
          <input type="hidden" value={tour.id} className="id-tour"/>
          <div className="row">
            <ImageSlider images={images}/>
            <TourInformation tour={tour}/>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-9">
              <div className="menu-body-tour menu-body-tour-mobile">
                <div>
                  <div className="menu-body-tour menu-body-tour-mobile" id="content-detail-tour">
                    <div className="row">
                      <div className="col-md-12 pl-pr">
                        <div className="item-scroll-news-pys" id="scroll_tour" style={{zIndex: 10}}>
                          <div className="item-news-pys scroll-fix-tour item-news-pys-detail-tour-mobile">
                            <ul className="nav nav-tour nav-tour-mobile" role="tablist">
                              <li className="nav-item nav-item-tour">
                                <a id="introduce" href="#gioithieu" className="nav-link nav-link-tour active" data-toggle="tab">
                                  Giới thiệu
                                </a>
                              </li>
                              <li className="nav-item nav-item-tour">
                                <a id="schedule" href="#lichtrinh" className="nav-link nav-link-tour" data-toggle="tab">Lịch
                                  trình</a>
                              </li>
                              {
                                !tour.tourFne && (
                                  <li className="nav-item nav-item-tour">
                                    <a id="clause" href="#dieukhoan" className="nav-link nav-link-tour" data-toggle="tab">Bao
                                      gồm và Điều khoản</a>
                                  </li>
                                )
                              }
                              <li className="nav-item nav-item-tour">
                                <a id="evaluate" href="#danhgia" className="nav-link nav-link-tour" data-toggle="tab">Đánh
                                  giá Tour</a>
                              </li>
                              <li className="nav-item nav-item-tour">
                                <a id="comment" href="#binhluan" className="nav-link nav-link-tour" data-toggle="tab">Bình
                                  luận</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-1 dp-n fb-mess">
                            <div className="fb-like" data-href={router.asPath}
                                 data-layout="box_count" data-action="like" data-size="small" data-show-faces="true"
                                 data-share="true"></div>
                          </div>
                          <Introduction tour={tour}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-3 dp-n-tablet dp-n-tablet-small">
              <div
                className={classNames('animated', 'dp-n', { 'position-fixed-info-tour-right' : scrollY >= 900, 'slideInDown': scrollY >= 900 })}
                id="position-fixed-info-tour-right"
                style={{zIndex: '100 !important'}}>
                <Advisory tour={tour}/>
                <BookingPanel tour={tour}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TourDetail;
