import "../../css/style.css";
export const Home = () => {
  return (
    <div className="ui raised very padded text container segment">
      <div className="ui text ">
        <h1 className="ui header">e-whiteboard</h1>
        <div className="ui segment">
          <p>
            This is a virtual whiteboard application where you can collaborate
            with others in real-time. Create and join whiteboards to brainstorm
            ideas, sketch diagrams, or work on projects together.
          </p>
        </div>
        <div className="ui segment">
          <p>
            Get started by signing up or logging in to your account. Once logged
            in, you can create your own whiteboards or join existing ones.
          </p>
        </div>
      </div>
    </div>
  );
};
