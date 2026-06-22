import { FC, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { useAppSelecter } from "../../app/hooks";
import { API_SERVER_HOST } from "../../config/config";
import { selectUserId, selectUserRole } from "../../features/user/userSlice";
import { buildApiUrl } from "../../utils/api";
import { Button } from "../common/Button";
import { Container } from "../common/Container";
import { FlexDiv } from "../common/FlexDiv";

interface WhiteboardListProps {}

interface Whiteboard {
  id: string;
  name: string;
}

function deleteWhiteboard(id: string) {
  return fetch(`${API_SERVER_HOST}/v1/whiteboards/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

function createWhiteboard(whiteboardData: { name: string }) {
  const { name } = whiteboardData;
  return fetch(`${API_SERVER_HOST}/v1/whiteboards`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
}

function getWhiteboardList(userId: string) {
  return fetch(
    buildApiUrl(API_SERVER_HOST, "/v1/whiteboards", {
      "user-id": userId,
    }),
    {
      credentials: "include",
    },
  ).then((resposne) => resposne.json());
}

function WhiteboardModal({
  setList,
  setIsModalOpen,
}: {
  setList: any;
  setIsModalOpen: any;
}) {
  const [name, setName] = useState("");
  const userId = useAppSelecter(selectUserId);

  return (
    <div>
      <WhiteboardModalBox>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          onClick={() => {
            createWhiteboard({
              name,
            }).then(() => {
              if (userId != null) {
                getWhiteboardList(userId.toString()).then(setList);
              }
            });
            setIsModalOpen(false);
          }}
        >
          create
        </Button>
      </WhiteboardModalBox>
    </div>
  );
}

export const WhiteboardList: FC<WhiteboardListProps> = () => {
  const userId = useAppSelecter(selectUserId);
  const userRole = useAppSelecter(selectUserRole);
  const [list, setList] = useState<Whiteboard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();
  const canMutateWhiteboards = userRole === "user";

  useEffect(() => {
    if (!userId) return;

    getWhiteboardList(userId.toString()).then(setList);
  }, [userId]);

  if (userId == null) {
    return <div>Loading...</div>;
  }

  function go2Whiteboard(id: string) {
    history.push(`/whiteboards/${id}`);
  }

  const handleDeleteWhiteboard = (id: string) => {
    if (!canMutateWhiteboards) {
      return;
    }

    if (!window.confirm("Delete this whiteboard? This cannot be undone.")) {
      return;
    }

    deleteWhiteboard(id).then(() => {
      setList((prev) => prev.filter((whiteboard) => whiteboard.id !== id));
    });
  };

  return (
    <Container>
      {canMutateWhiteboards ? (
        <>
          <Button onClick={() => setIsModalOpen(true)}>
            create a new whiteboard
          </Button>
          {isModalOpen && (
            <WhiteboardModal setList={setList} setIsModalOpen={setIsModalOpen} />
          )}
        </>
      ) : (
        <div>Guest sessions can open boards but cannot create or delete them.</div>
      )}
      <div>
        {list.map((whiteboard) => (
          <WhiteboardRow key={whiteboard.id}>
            <div>{whiteboard.id}</div>
            <div>{whiteboard.name}</div>
            <div>
              <Button onClick={() => go2Whiteboard(whiteboard.id)}>
                Go to whiteboard
              </Button>
            </div>
            <div>
              <Button>Edit</Button>
            </div>
            {canMutateWhiteboards && (
              <div>
                <Button onClick={() => handleDeleteWhiteboard(whiteboard.id)}>
                  delete
                </Button>
              </div>
            )}
          </WhiteboardRow>
        ))}
      </div>
    </Container>
  );
};

const WhiteboardRow = styled(FlexDiv)`
  align-items: center;
  justify-content: space-between;
  border-bottom-color: black;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  padding: 1rem;
`;

const WhiteboardModalBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  background-color: grey;
  padding: 3rem;
`;
