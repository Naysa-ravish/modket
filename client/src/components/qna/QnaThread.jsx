const QnaThread = ({ questions = [] }) => (
  <div className="space-y-4">
    {questions.map((item) => (
      <div
        key={item._id}
        className="rounded-2xl border border-brand-light bg-white p-4 shadow-sm"
      >
        <div className="mb-2 text-sm text-gray-500">
          Asked by {item.askedBy?.name || 'Student'}
        </div>
        <p className="font-medium text-brand-dark">{item.question}</p>
        {item.replies?.length > 0 ? (
          <div className="mt-3 space-y-2 border-t border-dashed border-gray-200 pt-3">
            {item.replies.map((reply, idx) => (
              <div key={idx} className="rounded-lg bg-brand-light/60 p-3 text-sm">
                <p className="font-semibold text-brand-pink">
                  {reply.author?.name || 'Seller'}
                </p>
                <p>{reply.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">Waiting for seller response</p>
        )}
      </div>
    ))}
    {!questions.length && (
      <p className="text-center text-sm text-gray-500">No questions yet</p>
    )}
  </div>
);

export default QnaThread;

