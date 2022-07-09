import React, { useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Container from "../components/common/Container";
import { instance } from "../api/axios";
import { useMutation } from "react-query";

function Register() {
  const navigate = useNavigate();
  const ref = {
    username: useRef(),
    nickname: useRef(),
    password: useRef(),
    passwordConfirm: useRef()
  }

  // 이메일 체크
  const {mutate: emailChkMutate} = useMutation("statusEmailCheck", async (username) => {
    const response = await instance.get(`/user/emailDupCheck/${username}`);
    return response.data;
  }, {
    onSuccess: data => {
      console.log(data);
      if (data) {
        alert("이메일 중복 없음");
      } else {
        alert("이메일 중복 있음");
      }
    },
    onError: err => {
      console.log(err);
    }
  });

  const emailChk = (e) => {
    e.preventDefault();
    emailChkMutate(ref.username.current.value);
  }

  // 닉네임 체크
  const {mutate: nicknameChkMutate} = useMutation("statusEmailCheck", async (nickname) => {
    const response = await instance.get(`/user/nameDupCheck/${nickname}`);
    return response.data;
  }, {
    onSuccess: data => {
      console.log(data);
      if (data) {
        alert("닉네임 중복 없음");
      } else {
        alert("닉네임 중복 있음");
      }
    },
    onError: err => {
      console.log(err);
    }
  });

  const nicknameChk = (e) => {
    e.preventDefault();
    nicknameChkMutate(ref.nickname.current.value);
  }

  // 회원가입
  const {mutate: register} = useMutation("user/register", async (data) => {
    const response = await instance.post(`/user/signup`, data);
    return response.data;
  }, {
    onSuccess: data => {
      if (data.result) {
        alert(data.errorMsg);
        navigate("/login");
      } else {
        alert(data.errorMsg);
      }
    },
    onError: err => {
      console.log(err);
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const username = ref.username.current.value;
    const nickname = ref.nickname.current.value;
    const password = ref.password.current.value;
    const passwordConfirm = ref.passwordConfirm.current.value;

    if (username === "" || password === "" || nickname === "") {
      alert("아이디, 닉네임, 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 이메일 정규식 교체 : ^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$
    if (/^([0-9a-zA-Z_\\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/.test(username) === false) {
      alert("이메일을 다시 확인해 주세요");
      return;
    }

    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/.test(password) === false) {
      alert("비밀번호는 1개 이상의 숫자, 1개 이상의 문자로 조합해야 하며 최소 4자 이상 입력해야 합니다.");
      return;
    }

    register({username, nickname, password, imgPath: null});
  };

  return (
    <Container>
      <Wrap>
        <Box>
          <h1>회원가입</h1>
          <LoginForm onSubmit={onSubmit}>
            <div>
              <p>아이디</p>
              <input type="text" placeholder="이메일을 입력해주세요" ref={ref.username} autoComplete="email"  />
              <button onClick={emailChk}>중복체크</button>
            </div>
            <div>
              <p>닉네임</p>
              <input type="text" placeholder="닉네임 입력해주세요" ref={ref.nickname} autoComplete="nickname"  />
              <button onClick={nicknameChk}>중복체크</button>
            </div>
            <div>
              <p>비밀번호</p>
              <input type="password" placeholder="비밀번호를 입력해주세요" ref={ref.password} autoComplete="password" />
            </div>
            <div>
              <p>비밀번호 확인</p>
              <input type="password" placeholder="비밀번호를 확인해주세요" ref={ref.passwordConfirm} autoComplete="new-password"  />
            </div>
            <div>
              <button>회원가입</button>
              <button onClick={(e) => {e.preventDefault(); navigate("/");}}>취소</button>
            </div>
          </LoginForm>
        </Box>
      </Wrap>
    </Container>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  padding: 50px;
  border: 1px solid #ddd;
  background-color: #fff;

  h1 {
    font-size: 24px;
    font-weight: 600;
  }
`;

const LoginForm = styled.form`
  > div {
    margin-top: 20px;
    display: flex;
    align-items: center;
    height: 50px;
    p {
      height: 100%;
      font-size: 20px;
      width: 120px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    input {
      height: 100%;
      font-size: 18px;
      border: 1px solid #ddd;
      box-sizing: border-box;
      padding: 0 20px;
    }

    button {
      display: block;
      width: 100px;
      height: 100%;
      flex-shrink: 0;
      border: none;
      font-size: 16px;
      box-sizing: border-box;
    }
  }
`;

export default Register;
