import styled from 'styled-components';

export const OwnerAvatar = styled.Image`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background: #eee;
`;
export const Info = styled.View`
  margin-left: 10px;
  flex: 1;
`;
export const Title = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-size: 15px;
  font-weight: bold;
  color: #333;
`;
export const Author = styled.Text`
  font-size: 13px;
  color: #666;
  margin-top: 2px;
`;
