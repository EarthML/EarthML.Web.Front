using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SInnovations.MarkDown.BlogEngine.Models;

namespace SInnovations.MarkDown.BlogEngine.Git
{
    public static class GitHelper
    {

        private static bool StartsWithHeader(string line)
        {
            if (line.Length > 0 && char.IsLetter(line[0]))
            {
                var seq = line.SkipWhile(ch => Char.IsLetter(ch) && ch != ':');
                return seq.FirstOrDefault() == ':';
            }
            return false;
        }

        public static IEnumerable<GitCommit> ParseGit(Stream data)
        {
            GitCommit commit = null;

            bool processingMessage = false;
            using (var strReader = new StreamReader(data))
            {
                do
                {
                    var line = strReader.ReadLine();

                    if (line.StartsWith("commit "))
                    {
                        if (commit != null)
                            yield return commit;

                        commit = new GitCommit();
                        commit.Sha = line.Split(' ')[1];
                    }

                    if (StartsWithHeader(line))
                    {
                        var header = line.Split(':')[0];
                        var val = string.Join(":", line.Split(':').Skip(1)).Trim();

                        // headers
                        commit.Headers.Add(header, val);
                    }

                    if (string.IsNullOrEmpty(line))
                    {
                        // commit message divider
                        processingMessage = !processingMessage;
                    }
                    else if (processingMessage)
                    {
                        // commit message.
                        commit.Message += line.Trim(' ');
                    }

                    if (line.Length > 1 && Char.IsLetter(line[0]) && line[1] == '\t')
                    {
                        var status = line.Split('\t')[0];
                        var file = line.Split('\t')[1];
                        commit.Files.Add(new GitFileStatus() { Status = status, File = file });
                    }
                }
                while (strReader.Peek() != -1);
            }
            if (commit != null)
                yield return commit;

        }
    }
}
