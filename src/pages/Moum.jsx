import { React, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import Container from "../components/common/Container";

import Header from "../components/common/Header";
import MoumProfile from "../components/Moum/MoumProfile";
import { setBackground } from "../redux/modules/optionSlice";
import { addPieceSimpleThunk, addPieceThunk, getPieceThunk, } from "../redux/modules/moumSlice";
import { instance } from "../shared/axios";
import { typeCategory } from "../shared/type";
import LinkPieceCard from "../components/card/LinkPieceCard";
import { getProfileDB } from "../redux/modules/profileSlice";

function Moum() {
  const dispatch = useDispatch();

  const moum = useSelector((state) => state.moum);
  const user = useSelector((state) => state.profile.list);

  const [input, setInput] = useState({
    subject: "",
    link: "",
    content: "",
    share: "NONE",
    type: "NONE",
    category: "기타",
  });
  const handleChange = useCallback((name) => (e) => setInput((current) => ({...current, [name]: e.target.value})), []);

  useEffect(() => {
    dispatch(setBackground("#F5F5F5")); // 이 페이지에서만 회색 배경
    dispatch(getPieceThunk());
    dispatch(getProfileDB());
    return (() => {
      dispatch(setBackground("#FFFFFF")); // 페이지가 사라질 때 흰색 배경으로 복구
    });
  }, [dispatch]);

  useEffect(() => {console.log(moum)}, [moum])
  useEffect(() => {console.log(user)}, [user])

  const addPiece = (e) => {
    e.preventDefault();
    dispatch(addPieceThunk(input));
  }

  const addPieceSimple = (e) => {
    e.preventDefault();
    dispatch(addPieceSimpleThunk(input));
  }

  const getOG = async (e) => {
    e.preventDefault();
    // e.stopPropagation();

    try {
      const response = await instance.post("/image/og", {url: input.link});
      const {image, title, description} = response.data;
      setInput((current) => ({...current, image, subject: title, content: description}));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container>
      <Title>
        <Header />
        <div className="desc">
          <em>간편한 정보 아카이빙, moum</em>
          <p>링크, 글, 이미지 조각을 모아두고 쉽게 찾을 수 있어요.</p>
        </div>
        <form className="maker" onSubmit={addPieceSimple}>
          <div>
            <select className="select-type" onChange={handleChange("type")} value={input.type}>
              <option value="NONE">선택</option>
              <option value="LINK">링크</option>
              <option value="MEMO">메모</option>
            </select>
          </div>
          <input type="text" onChange={handleChange("content")} value={input.content}/>
          <button>바로 생성하기</button>
        </form>
      </Title>
      <Content>
        <MoumProfile user={user}/>
        <PieceBoard>
          <MoumHeader>
            <CategoryGroup>
              <div className="category-title">카테고리</div>
              <ul className="category-list">
                <Category isActive={true}>전체</Category>
                <Category>음식</Category>
                <Category>여행</Category>
                <Category>운동</Category>
              </ul>
            </CategoryGroup>
            <SortGroup>
              <select>
                <option>최신 조각순</option>
                <option>사용자 지정순</option>
              </select>
              <form>
                <input type="text" />
                <button>검색</button>
              </form>
            </SortGroup>
          </MoumHeader>
          <MoumList>
            <LinkPieceCard />
            <LinkPieceCard />
            <LinkPieceCard />
            <LinkPieceCard />
            <LinkPieceCard />
            <LinkPieceCard />
            <LinkPieceCard />
            <LinkPieceCard />
            <LinkPieceCard />
            <LinkPieceCard />
            {/* {postList.boardList?.map((post, i) => {
              return (
                <div key={i}>
                  <div>{post.title}</div>
                  <div>{post.content}</div>
                  <div>{post.explanation}</div>
                  <div>{post.imgPath}</div>
                  <button onClick={() => { modifyBoard(post.id) }}>수정</button>
                  <button onClick={() => { removeBoard(post.id) }}>삭제</button>
                </div>
              )
            })} */}
          </MoumList>
          <div>
            <div>링크타입</div>
            <form onSubmit={addPiece}>
              제목<input type="text" onChange={handleChange("subject")} value={input.subject} />
              링크<input type="text" onChange={handleChange("link")} value={input.link} />
              <button onClick={getOG}>OG가져오기</button>
              내용<input type="text" onChange={handleChange("content")} value={input.content} />
              <select onChange={handleChange("share")} value={input.share}>
                <option value="NONE">공유선택</option>
                <option value="PUBLIC">공개</option>
                <option value="PRIVATE">비공개</option>
              </select>
              <select onChange={handleChange("type")} value={input.type}>
                <option value="NONE">타입선택</option>
                <option value="LINK">링크</option>
                <option value="MEMO">메모</option>
              </select>
              <select onChange={handleChange("category")} value={input.category}>
                {typeCategory.map((opt) => {
                  return <option key={opt.value} value={opt.value}>{opt.text}</option>
                })}
              </select>
              <button>추가</button>
            </form>
            {/* <div>메모타입</div>
            <form>
              <input type="text" ref={titletRef} />
              <input type="text" ref={contentRef} />
              <select ref={statusRef}>
                <option value="PUBLIC">PUBLIC</option>
                <option value="PRIVATE">PRIVATE</option>
              </select>
              <select ref={boardTypeRef}>
                <option value="MEMO">MEMO</option>
              </select>
              <button>추가</button>
            </form> */}
          </div>
        </PieceBoard>
      </Content>
    </Container>
  )
}

const Title = styled.div`
  width: 100%;
  height: 500px;
  background-color: #E5D6FF;
  border-radius: 0 0 60px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .desc {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    em {
      font-size: 36px;
      color: #5B2EDA;
    }

    p {
      padding-top: 20px;
      font-size: 20px;
      color: #9975FF;
    }
  }

  form.maker {
    margin-top: 90px;
    width: 620px;
    height: 50px;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    box-shadow: 0px 2px 16px 4px rgba(145, 82, 255, 0.2);
    border-radius: 25px;

    > div {
      flex-shrink: 0;
      width: 80px;
      height: 70%;
      border-right: 1px solid #ddd;
      display: flex;
      justify-content: center;
      align-items: center;

      select {
        border: none;
        width: 60%;
        height: 100%;
      }
      /* div.selected-type {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      ul.select-type {
        display: none;
        li {

        }
      } */
    }

    input {
      border: none;
      width: 100%;
    }

    button {
      flex-shrink: 0;
      width: 150px;
      font-size: 16px;
      border: none;
      background: transparent;
      color: #721EFC;
      cursor: pointer;
    }
  }
`;

const Content = styled.div`
  width: 1200px;
`;

const PieceBoard = styled.div`
  margin-top: 80px;
`;

const MoumHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const CategoryGroup = styled.div`
  .category-title {
    font-size: 22px;
    color: #111111;
    font-weight: bold;
  }

  .category-list {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
  }
`;

const Category = styled.li`
  padding: 0 15px;
  height: 40px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  border-radius: 20px;
  ${({isActive}) => isActive ? css`
    border: 1px solid #721EFC;
    color: #721EFC;
  ` : css`
    border: 1px solid #C8C8C8;
    color: #555555;
  `}

  & + & {
    margin-left: 10px;
  }
`;

const SortGroup = styled.div`
`;

const MoumList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  > div {
    width: calc(92% / 4);
  }

  > div + div {
    margin-left: calc(8% / 3);
  }

  > div:nth-of-type(4n + 1) {
    margin-left: 0;
  }

  > div:nth-of-type(n + 5) {
    margin-top: calc(8% / 3);
  }
`;

export default Moum;

/*
  const addBoard = (e) => {
    e.preventDefault();

    const data = {
      title: titletRef.current.value,
      content: contentRef.current.value,
      status: statusRef.current.value,
      boardType: boardTypeRef.current.value
    }

    dispatch(addDataDB(data));
    titletRef.current.value = "";
    contentRef.current.value = "";
    statusRef.current.value = "";
    boardTypeRef.current.value = "";
  }

  const modifyBoard = (id) => {
    const data = {
      title: titletRef.current.value,
      content: contentRef.current.value,
      status: statusRef.current.value,
      boardType: boardTypeRef.current.value,
    }

    dispatch(modifyDataDB(id, data));

    titletRef.current.value = "";
    contentRef.current.value = "";
    statusRef.current.value = "";
    boardTypeRef.current.value = "";
  }

  const removeBoard = (id) => {
    dispatch(removeDataDB(id));
  }
*/