// module
import styled, { css } from "styled-components";
import { useState } from "react";
import { useMutation } from "react-query";

// image
import more from "assets/images/pages/moum/menu-white.png";
import moum from "assets/images/pages/moum/moum-background.png";
import iconPrivate from "assets/images/pages/moum/icon-private.png";
import iconPieceCount from "assets/images/pages/moum/icon-piece-count.png";
import iconScrapCount from "assets/images/pages/moum/icon-scrap-count.png";
import { instance } from "shared/axios";
import queryClient from "shared/query";


function MoumCard({moum}) {
  const [buttonState, setButtonState] = useState(false);

  const {mutate: copy} = useMutation(async (folderId) => {
    const response = await instance.post(`/myshare/folder/${folderId}`, {});
    return response.data;
  }, {
    onSuccess: data => {
      queryClient.invalidateQueries("mine/moums");
      alert("복사 성공");
    },
    onError: err => {
      console.log(err);
    }
  });

  const copyFolder = () => {
    copy(moum.id);
  }

  function comma(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

  return (
    <Container>
      <div className="card-content">
        <div className="card-header">
          {moum.status === "PRIVATE" && <img src={iconPrivate} alt="private" />}
          <div className="menu" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setButtonState((current) => !current);
          }}><img src={more} alt="" /></div>
        </div>
        <div className={`card-title ${moum.status === "PUBLIC" && `no-image`}`}>{moum.name}</div>
      </div>
      <div className="card-info">
        <div className="piece-count">
          <Icon><img src={iconPieceCount} alt="전체 조각 개수" /></Icon>
          <Text>전체 조각</Text>
          <Count>{comma(moum.boardCnt)}개</Count>
        </div>
        <div className="scrap-count">
          <Icon><img src={iconScrapCount} alt="스크랩 횟수" /></Icon>
          <Text>스크랩</Text>
          <Count>{comma(moum.sharedCount)}회</Count>
        </div>
      </div>
      <CardOption isActive={buttonState}>
        <div onClick={copyFolder}>복사하기</div>
      </CardOption>
    </Container>
  );
}

const Container = styled.div`
  width: 282px;
  height: 314px;
  background-image: url(${moum});
  background-size: 100%;
  background-repeat: no-repeat;
  border-radius: 15px;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  cursor: pointer;

  .menu {
    position: absolute;
    right: 25px;
    top: 50px;
  }

  .card-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    flex-shrink: 0;

    > img {
      margin-top: 10px;
    }

    .category {
      width: 70px;
      height: 25px;
      font-size: 12px;
      background-color: #D9D9D9;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 12.ㄴ5px;
    }
  }



  .card-title {
    padding: 20px 20px 0;
    font-size: 20px;
    line-height: 1.2;
    color: #FFFFFF;
  }

  .card-title.no-image {
    padding: 62px 20px 0;
  }

  .card-description {
    margin-top: 15px;
    margin-bottom: 20px;
    padding: 0 20px;
    line-height: 1.2;
    color: #FFFFFF;
  }

  .card-image {
    width: 100%;
    height: 100%;
    background-color: #ABABAB;
    border-radius: 0 0 15px 15px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-info {
    color: #FFFFFF;
    position: absolute;
    bottom: 25px;
    left: 25px;

    .piece-count, .scrap-count {
      display: flex;
    }

    .scrap-count {
      margin-top: 10px;
    }
  }
`;

const Icon = styled.div`
  width: 20px;
`;
const Text = styled.div`
  width: 60px;
  font-size: 14px;
  margin-left: 5px;
`;
const Count = styled.div`
  font-size: 14px;
  margin-left: 10px;
  letter-spacing: 1px;
`;

const CardOption = styled.div`
  position: absolute;
  width: 100px;
  height: 50px;
  background-color: #FFFFFF;
  right: -50px;
  top: 80px;
  border: 1px solid #ddd;
  z-index: 1;
  display: none;

  ${props => props.isActive && css`
    display: block;
  `};

  div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  div:hover {
    background-color: #ddd;
  }

  div + div {
    border-top: 1px solid #ddd;
  }
`;

export default MoumCard;